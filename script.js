document.addEventListener('DOMContentLoaded', () => {
    const loadUsersButton = document.getElementById('load-users');
    const userList = document.getElementById('user-list');

    loadUsersButton.addEventListener('click', () => {
        fetch('http://localhost:3000/api/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da API: ' + response.status);
                }
                return response.json();
            })
            .then(users => {
                if (!Array.isArray(users)) {
                    throw new Error('Dados da API não são um array');
                }
                userList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
                users.forEach(user => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${user.name} (${user.email})`; // Ajuste conforme a estrutura dos seus dados

                    const actionsDiv = document.createElement('div');
                    actionsDiv.classList.add('user-actions');

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.classList.add('edit-button');
                    editButton.addEventListener('click', () => editUser(user.idusers));

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Deletar';
                    deleteButton.classList.add('delete-button');
                    deleteButton.addEventListener('click', () => deleteUser(user.idusers));

                    actionsDiv.appendChild(editButton);
                    actionsDiv.appendChild(deleteButton);

                    listItem.appendChild(actionsDiv);
                    userList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar usuários:', error);
                userList.innerHTML = '<li>Erro ao carregar usuários. Veja o console para mais detalhes.</li>';
            });
    });

    function editUser(userId, currentName, currentEmail) {
        const newName = prompt('Digite o novo nome:', currentName);
        const newEmail = prompt('Digite o novo email:', currentEmail);

        if (newName && newEmail) {
            fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName, email: newEmail }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar usuário: ' + response.status);
                }
                return response.json();
            })
            .then(updatedUser => {
                console.log('Usuário atualizado com sucesso:', updatedUser);
                // Opcional: atualizar a lista de usuários
                loadUsersButton.click();
            })
            .catch(error => {
                console.error('Erro ao atualizar usuário:', error);
            });
        } else {
            alert('Nome e email não podem estar vazios.');
        }
    }

    function deleteUser(userId) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { // Obter a resposta do corpo para diagnóstico
                            throw new Error(`Erro ao excluir usuário: ${response.status} - ${text}`);
                        });
                    }
                    alert('Usuário excluído com sucesso!');
                    loadUsersButton.click(); // Recarregar a lista de usuários após exclusão
                })
                .catch(error => {
                    console.error('Erro ao excluir usuário:', error);
                    alert('Erro ao excluir usuário. Veja o console para mais detalhes.');
                });
        }
    }
});