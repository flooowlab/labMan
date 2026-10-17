import { readDb } from './db.js';
import { ApiError } from './types.js';
import { getMembership } from './auth.js';
import type { AvailabilityRule, Authorization, Item, JwtPayload } from './types.js';

/**
 * Asserts that a user is eligible to borrow an item under the given lab.
 * Returns the authorization_id used (if any), or null.
 * Throws ApiError on any eligibility failure.
 *
 * Input:  labId, item record, user JWT payload
 * Output: authorization_id string | null
 */
export async function assertEligible(
  labId: string,
  item: Item,
  user: JwtPayload,
): Promise<string | null> {
  const membership = getMembership(user, labId);
  if (!membership) throw new ApiError(403, 'Not a member of this lab');

  if (
    membership.borrow_restricted_until &&
    new Date(membership.borrow_restricted_until) > new Date()
  ) {
    throw new ApiError(
      403,
      `Borrowing suspended until ${membership.borrow_restricted_until} due to no-shows or policy violation.`,
    );
  }

  const rules = readDb<AvailabilityRule>(labId, 'availability_rules.json');
  const rule = item.availability_rule_id
    ? rules.find((r) => r.id === item.availability_rule_id)
    : null;

  if (!rule) return null;

  if (!rule.allowed_user_types.includes(membership.user_type)) {
    throw new ApiError(403, `This item is not available to ${membership.user_type} users`);
  }

  if (membership.user_type === 'student' && membership.student_level < rule.min_student_level) {
    throw new ApiError(403, `This item requires year ${rule.min_student_level} or above`);
  }

  if (rule.requires_instructor_auth && membership.user_type === 'student') {
    const auths = readDb<Authorization>(labId, 'authorizations.json');
    const valid = auths.find(
      (a) =>
        a.student_id === user.user_id &&
        a.item_category === item.category &&
        a.is_active &&
        new Date(a.expires_at) > new Date(),
    );
    if (!valid) {
      throw new ApiError(
        403,
        'An instructor authorization is required for this item category',
      );
    }
    return valid.id;
  }

  return null;
}
