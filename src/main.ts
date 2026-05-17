import type { DCFModel } from './types.js';
import { getAllModels, deleteModel, saveModel, generateId, createDefaultWACC, createDefaultDCF, importModels } from './storage.js';

function renderModelList(): void {
  const container = document.getElementById('model-list')!;
  const models = getAllModels();

  if (models.length === 0) {
    container.innerHTML = '<p class="empty-hint">No models yet. Click the button above to create one.</p>';
    return;
  }

  const rows = models.map(m => `
    <tr class="clickable-row" data-id="${m.id}">
      <td>${escapeHtml(m.name)}</td>
      <td>${m.years}Y</td>
      <td>${formatDate(m.createdAt)}</td>
      <td>${formatDate(m.updatedAt)}</td>
      <td class="actions">
        <button class="btn btn-sm btn-danger" data-delete="${m.id}" data-name="${escapeHtml(m.name)}">Delete</button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Horizon</th>
          <th>Created</th>
          <th>Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  // Click row to edit
  container.querySelectorAll('.clickable-row').forEach(row => {
    row.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-delete]')) return;
      window.location.href = `model?id=${(row as HTMLElement).dataset.id}`;
    });
  });
  container.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = btn as HTMLElement;
      if (confirm(`Delete model "${el.dataset.name}"? This cannot be undone.`)) {
        deleteModel(el.dataset.delete!);
        renderModelList();
      }
    });
  });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function createModel(years: 10 | 20): void {
  const model: DCFModel = {
    id: generateId(),
    name: 'Untitled',
    years,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    wacc: createDefaultWACC(),
    dcf: createDefaultDCF(years),
  };
  saveModel(model);
  window.location.href = `model?id=${model.id}`;
}

function showDialog(): void {
  document.getElementById('create-dialog')!.classList.add('show');
}

function hideDialog(): void {
  document.getElementById('create-dialog')!.classList.remove('show');
}

function exportAll(): void {
  const models = getAllModels();
  if (models.length === 0) { alert('No models to export.'); return; }
  const blob = new Blob([JSON.stringify(models, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dcf-models-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleImport(file: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string);
      const models: DCFModel[] = Array.isArray(data) ? data : [data];
      const count = importModels(models);
      alert(`Imported ${count} model(s) successfully.`);
      renderModelList();
    } catch {
      alert('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
  renderModelList();

  document.getElementById('btn-new')!.addEventListener('click', showDialog);
  document.getElementById('btn-10y')!.addEventListener('click', () => createModel(10));
  document.getElementById('btn-20y')!.addEventListener('click', () => createModel(20));
  document.getElementById('btn-cancel')!.addEventListener('click', hideDialog);

  document.getElementById('btn-export')!.addEventListener('click', exportAll);

  const fileInput = document.getElementById('file-import') as HTMLInputElement;
  document.getElementById('btn-import')!.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      handleImport(fileInput.files[0]);
      fileInput.value = '';
    }
  });

  document.getElementById('create-dialog')!.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideDialog();
  });
});
