document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm === '') return;

        searchUsers(searchTerm);
    });

    function searchUsers(searchTerm) {
        fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(data => {
            displayUsers(data.items);
        })
        .catch(error => {
            console.error('Error searching for users:', error);
            alert('Error searching for users. Please try again.');
        });
    }

    function getUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user repositories');
            }
            return response.json();
        })
        .then(data => {
            displayRepos(data);
        })
        .catch(error => {
            console.error('Error fetching user repositories:', error);
            alert('Error fetching user repositories. Please try again.');
        });
    }

    function displayUsers(users) {
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = user.html_url;
            link.textContent = user.login;
            li.appendChild(link);
            userList.appendChild(li);

            link.addEventListener('click', function (event) {
                event.preventDefault();
                getUserRepos(user.login);
            });
        });
    }

    function displayRepos(repos) {
        reposList.innerHTML = '';
        repos.forEach(repo => {
            const li = document.createElement('li');
            li.textContent = repo.name;
            reposList.appendChild(li);
        });
    }
});
