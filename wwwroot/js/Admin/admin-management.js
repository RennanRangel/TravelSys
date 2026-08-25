document.addEventListener('DOMContentLoaded', function () {
    const statusFilters = document.querySelectorAll('input[name="status-filter"]');
    const tableRows = document.querySelectorAll('.mgmt-table tbody tr');
    const searchInput = document.querySelector('.mgmt-search-input');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const btnAcoesMassa = document.getElementById('btnAcoesMassa');

    function filterTable() {
        const checkedFilter = document.querySelector('input[name="status-filter"]:checked');
        const selectedStatus = checkedFilter ? checkedFilter.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const priceFilter = document.getElementById('filterPrice');
        const maxPrice = priceFilter ? parseFloat(priceFilter.value) : Number.MAX_VALUE;

        tableRows.forEach(row => {
            const rowStatus = row.getAttribute('data-status');
            const rowText = row.innerText.toLowerCase();
            const priceCell = row.querySelector('[data-price]');
            const rowPrice = priceCell ? parseFloat(priceCell.getAttribute('data-price')) : 0;

            const matchesStatus = (selectedStatus === 'all' || rowStatus === selectedStatus);
            const matchesSearch = rowText.includes(searchTerm);
            const matchesPrice = rowPrice <= maxPrice;

            if (matchesStatus && matchesSearch && matchesPrice) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterTable);
    }

    statusFilters.forEach(filter => {
        filter.addEventListener('change', filterTable);
    });

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(cb => {
                if(cb.closest('tr').style.display !== 'none') {
                    cb.checked = selectAllCheckbox.checked;
                }
            });
            toggleMassActions();
        });
    }

    rowCheckboxes.forEach(cb => {
        cb.addEventListener('change', toggleMassActions);
    });

    function toggleMassActions() {
        const anyChecked = Array.from(rowCheckboxes).some(cb => cb.checked);
        if (btnAcoesMassa) {
            btnAcoesMassa.disabled = !anyChecked;
        }
    }

    filterTable();

    window.applyFilters = function() {
        filterTable();
        document.body.click(); 
    };

    window.deleteSelected = function(type) {
        const selectedIds = Array.from(rowCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.value));

        if (selectedIds.length === 0) {
            alert('Por favor, selecione pelo menos um item na tabela primeiro.');
            return;
        }

        if (confirm(`Tem certeza que deseja excluir os ${selectedIds.length} itens selecionados?`)) {
            const url = type === 'flight' ? '/Admin/DeleteMassFlight' : '/Admin/DeleteMassHotel';
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedIds)
            })
            .then(res => {
                if(res.ok) window.location.reload();
                else alert('Erro ao excluir itens. Tente novamente.');
            })
            .catch(err => alert('Erro: ' + err));
        }
    };
});
