import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'

// Role: name (unique), description, permissions (M2M)
// UserRole: user (FK), role (FK) — unique (user, role)
// Menu: name, url, icon, parent (self FK), order, is_active
// RoleMenu: role (FK), menu (FK), can_view/create/edit/delete — unique (role, menu)
// AdminProfile/AdminUser: username, email, first_name, last_name, is_active + full_name, phone, department, position
interface RoleRow { id: number; name: string; desc: string }
interface MenuRow { id: number; name: string; url: string; order: string }

export function RolesMenusPage() {
  const [roles, setRoles] = useState<RoleRow[]>([
    { id: 1, name: 'admin', desc: 'Administrator KKP penuh' },
    { id: 2, name: 'regulator', desc: 'Pengawas & override kuota' },
    { id: 3, name: 'owner', desc: 'Pemilik kapal & armada' },
    { id: 4, name: 'captain', desc: 'Nahkoda operasional' }
  ])
  const [menus, setMenus] = useState<MenuRow[]>([
    { id: 1, name: 'Ringkasan', url: '/admin', order: '1' },
    { id: 2, name: 'Kapal', url: '/admin/ships', order: '2' },
    { id: 3, name: 'Laporan Tangkapan', url: '/admin/catches', order: '3' }
  ])
  const [rForm, setRForm] = useState({ name: '', description: '' })
  const [mForm, setMForm] = useState({ name: '', url: '', icon: '', parent: '', order: '0', is_active: true })
  const [uForm, setUForm] = useState({ username: '', email: '', full_name: '', phone: '', department: '', position: '' })

  const roleCols: Column<RoleRow>[] = [
    { key: 'name', header: 'Peran', flex: 2, render: (r) => <span className="text-sm font-bold">{r.name}</span> },
    { key: 'desc', header: 'Deskripsi', flex: 3, render: (r) => <span className="text-sm text-fco-muted">{r.desc}</span> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRoles((p) => p.filter((x) => x.id !== r.id))} /> }
  ]
  const menuCols: Column<MenuRow>[] = [
    { key: 'name', header: 'Menu / URL', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.name}</div><div className="text-xs text-fco-muted">{r.url}</div></div>) },
    { key: 'order', header: 'Urutan', flex: 1, align: 'center', render: (r) => <span className="text-sm tabular-nums">{r.order}</span> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setMenus((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  return (
    <div>
      <PageHeader title="Peran & Menu" desc="Role, UserRole, Menu (name, url, icon, parent, order, is_active), RoleMenu (can_view/create/edit/delete), AdminUser + AdminProfile." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start mb-4">
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Daftar peran</h2>
          <DataTable columns={roleCols} rows={roles} rowKey={(r) => String(r.id)} />
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Daftar menu</h2>
          <DataTable columns={menuCols} rows={menus} rowKey={(r) => String(r.id)} />
        </section>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Tambah peran</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (!rForm.name) return; setRoles((p) => [...p, { id: Date.now(), name: rForm.name, desc: rForm.description }]); setRForm({ name: '', description: '' }) }} className="flex flex-col gap-4">
            <FormField label="Nama peran (unik)" htmlFor="rl-name"><input id="rl-name" required value={rForm.name} onChange={(e) => setRForm({ ...rForm, name: e.target.value })} className={inputCls} /></FormField>
            <FormField label="Deskripsi" htmlFor="rl-desc"><textarea id="rl-desc" rows={2} value={rForm.description} onChange={(e) => setRForm({ ...rForm, description: e.target.value })} className="w-full border border-fco-border rounded-xl p-3 text-fco-md focus:outline-none focus:border-fco-blue" /></FormField>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan peran</button>
          </form>
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Tambah menu</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (!mForm.name) return; setMenus((p) => [...p, { id: Date.now(), name: mForm.name, url: mForm.url, order: mForm.order }]) }} className="flex flex-col gap-4">
            <FormField label="Nama menu" htmlFor="mn-name"><input id="mn-name" required value={mForm.name} onChange={(e) => setMForm({ ...mForm, name: e.target.value })} className={inputCls} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="URL" htmlFor="mn-url"><input id="mn-url" value={mForm.url} onChange={(e) => setMForm({ ...mForm, url: e.target.value })} placeholder="/admin/..." className={inputCls} /></FormField>
              <FormField label="Ikon" htmlFor="mn-icon"><input id="mn-icon" value={mForm.icon} onChange={(e) => setMForm({ ...mForm, icon: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Menu induk (parent id)" htmlFor="mn-parent"><input id="mn-parent" value={mForm.parent} onChange={(e) => setMForm({ ...mForm, parent: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Urutan" htmlFor="mn-order"><input id="mn-order" type="number" value={mForm.order} onChange={(e) => setMForm({ ...mForm, order: e.target.value })} className={inputCls} /></FormField>
            </div>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan menu</button>
          </form>
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Tambah admin (AdminUser)</h2>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Username" htmlFor="au-user"><input id="au-user" required value={uForm.username} onChange={(e) => setUForm({ ...uForm, username: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Email" htmlFor="au-email"><input id="au-email" type="email" value={uForm.email} onChange={(e) => setUForm({ ...uForm, email: e.target.value })} className={inputCls} /></FormField>
            </div>
            <FormField label="Nama lengkap" htmlFor="au-name"><input id="au-name" value={uForm.full_name} onChange={(e) => setUForm({ ...uForm, full_name: e.target.value })} className={inputCls} /></FormField>
            <FormField label="Telepon" htmlFor="au-phone"><input id="au-phone" value={uForm.phone} onChange={(e) => setUForm({ ...uForm, phone: e.target.value })} className={inputCls} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Departemen" htmlFor="au-dept"><input id="au-dept" value={uForm.department} onChange={(e) => setUForm({ ...uForm, department: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Posisi" htmlFor="au-pos"><input id="au-pos" value={uForm.position} onChange={(e) => setUForm({ ...uForm, position: e.target.value })} className={inputCls} /></FormField>
            </div>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan admin</button>
          </form>
        </section>
      </div>
    </div>
  )
}
