<script lang="ts">
  import type { PageData } from './$types';
  import { fmtDate } from '$lib/utils.js';
  let { data } = $props<{ data: PageData }>();

  const isAdmin = data.role === 'admin';
  let showRegister = $state(false);
  let regError = $state('');
  let regLoading = $state(false);

  async function registerUser(e: SubmitEvent) {
    e.preventDefault();
    regError = ''; regLoading = true;
    const fd = new FormData(e.target as HTMLFormElement);
    // Create user
    const res = await fetch(`/api/${data.labId}/users`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'), email: fd.get('email'),
        password: fd.get('password'),
        role: fd.get('role'), user_type: fd.get('user_type'),
      }),
    });
    const json = await res.json();
    regLoading = false;
    if (!res.ok) { regError = json.error ?? 'Failed to register user'; return; }
    showRegister = false;
    window.location.reload();
  }
</script>

<svelte:head><title>Users — Lab Manager</title></svelte:head>

<div class="ph">
  <h1 class="ph-title">Users</h1>
  {#if isAdmin}
    <button class="btn btn-primary btn-sm" onclick={() => showRegister = !showRegister}>+ Register User</button>
  {/if}
</div>

{#if showRegister && isAdmin}
  <div class="card mb2">
    <div class="card-head"><span class="card-title">Register New User</span></div>
    <div class="card-body">
      {#if regError}<div class="notice notice-error mb1">{regError}</div>{/if}
      <form onsubmit={registerUser} style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;max-width:640px">
        <div>
          <label class="form-label">Full Name <span style="color:var(--c-danger)">*</span></label>
          <input class="input-field" name="name" required placeholder="Jane Smith" />
        </div>
        <div>
          <label class="form-label">Email <span style="color:var(--c-danger)">*</span></label>
          <input class="input-field" type="email" name="email" required placeholder="jane@example.com" />
        </div>
        <div>
          <label class="form-label">Temporary Password <span style="color:var(--c-danger)">*</span></label>
          <input class="input-field" type="password" name="password" required minlength="8" autocomplete="new-password" />
        </div>
        <div>
          <label class="form-label">Role</label>
          <select class="input-field" name="role">
            <option value="student">Student</option>
            <option value="viewer">Viewer</option>
            <option value="instructor">Instructor</option>
            <option value="technician">Technician</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div>
          <label class="form-label">User Type</label>
          <select class="input-field" name="user_type">
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="faculty">Faculty</option>
            <option value="external">External</option>
          </select>
        </div>
        <div style="grid-column:1/-1;display:flex;gap:0.5rem;margin-top:0.25rem">
          <button type="submit" class="btn btn-primary btn-sm" disabled={regLoading}>{regLoading ? 'Registering…' : 'Register'}</button>
          <button type="button" class="btn btn-ghost btn-sm" onclick={() => showRegister = false}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<form method="GET" class="flex-gap mb2">
  <input name="q" value={data.q} placeholder="Search name or email…" style="padding:0.5rem 0.75rem;border:1px solid var(--c-border-2);min-width:240px" />
  <button type="submit" class="btn btn-secondary btn-sm">Search</button>
  {#if data.q}<a href="?" class="btn btn-ghost btn-sm">Clear</a>{/if}
</form>

<div class="card">
  <div class="table-wrap">
    {#if data.rows.length === 0}
      <p class="empty-msg">No users found.</p>
    {:else}
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Type</th><th>Active Borrows</th><th>No-Shows</th><th>Restricted Until</th><th></th></tr></thead>
        <tbody>
          {#each data.rows as r}
            <tr>
              <td>{r.name}</td>
              <td class="text-sm">{r.email}</td>
              <td><span class="badge badge-blue">{r.role}</span></td>
              <td class="text-sm text-muted">{r.userType ?? '—'}</td>
              <td><span class="badge {r.activeBorrows > 0 ? 'badge-yellow' : 'badge-gray'}">{r.activeBorrows}</span></td>
              <td class="text-sm">{r.noShows}</td>
              <td class="text-sm">{r.restrictedUntil ? fmtDate(r.restrictedUntil) : '—'}</td>
              <td><a href="users/{r.userId}" class="btn btn-ghost btn-sm">View</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
