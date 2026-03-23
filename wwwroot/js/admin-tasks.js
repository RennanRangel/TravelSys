/**
 * Gerenciamento de Tarefas Administrativas (Kanban)
 */
document.addEventListener('DOMContentLoaded', function() {
    // 1. Configuração de Drag and Drop
    const initializeDragAndDrop = () => {
        // Tornar os cards arrastáveis
        document.querySelectorAll('.kanban-drop-zone .admin-card').forEach(card => {
            card.setAttribute('draggable', 'true');

            card.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.dataset.taskId);
                this.classList.add('dragging');
            });

            card.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
        });

        // Configurar as zonas de drop
        document.querySelectorAll('.kanban-drop-zone').forEach(zone => {
            zone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });

            zone.addEventListener('drop', async function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');

                const taskId = parseInt(e.dataTransfer.getData('text/plain'));
                const newStatus = this.dataset.status;

                if (!taskId || !newStatus) return;

                const response = await fetch('/Admin/UpdateTaskStatus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: taskId, status: newStatus })
                });

                if (response.ok) {
                    location.reload();
                }
            });
        });
    };

    initializeDragAndDrop();

    // 2. Funções Globais para o Modal e Operações CRUD
    window.openNewTaskModal = function() {
        const modalEl = document.getElementById('newTaskModal');
        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }
    };

    window.createTask = async function() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const status = document.getElementById('taskStatus').value;

        if (!title) {
            alert('Por favor, informe o título da tarefa.');
            return;
        }

        const response = await fetch('/Admin/CreateTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority, status })
        });

        if (response.ok) {
            location.reload();
        } else {
            alert('Erro ao criar tarefa.');
        }
    };

    window.moveTask = async function(id, newStatus) {
        const response = await fetch('/Admin/UpdateTaskStatus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });

        if (response.ok) {
            location.reload();
        }
    };

    window.deleteTask = async function(id) {
        if (!confirm('Deseja realmente excluir esta tarefa?')) return;

        const response = await fetch('/Admin/DeleteTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (response.ok) {
            location.reload();
        }
    };
});
