var jobs = [], editId = null;

document.getElementById('jobForm').onsubmit = function(e) {
    e.preventDefault();
    var job = {
        id: editId || Date.now(),
        title: document.getElementById('jobTitle').value,
        company: document.getElementById('companyName').value,
        location: document.getElementById('location').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value
    };
    
    if (editId) {
        for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].id === editId) jobs[i] = job;
        }
        editId = null;
    } else {
        jobs.push(job);
    }
    
    this.reset();
    showJobs();
};

function showJobs() {
    var html = '';
    for (var i = 0; i < jobs.length; i++) {
        html += '<div class="job-card" data-category="' + jobs[i].category + '"><h3>' + jobs[i].title + ' at ' + jobs[i].company + '</h3><p><strong>Location:</strong> ' + jobs[i].location + '</p><p>' + jobs[i].description + '</p><div class="job-actions"><button class="btn btn-warning" onclick="editJob(' + jobs[i].id + ')">Edit</button><button class="btn btn-danger" onclick="deleteJob(' + jobs[i].id + ')">Delete</button></div></div>';
    }
    document.getElementById('dynamicJobs').innerHTML = html;
    filter();
}

function deleteJob(id) {
    var temp = [];
    for (var i = 0; i < jobs.length; i++) {
        if (jobs[i].id !== id) temp.push(jobs[i]);
    }
    jobs = temp;
    showJobs();
}

function editJob(id) {
    for (var i = 0; i < jobs.length; i++) {
        if (jobs[i].id === id) {
            document.getElementById('jobTitle').value = jobs[i].title;
            document.getElementById('companyName').value = jobs[i].company;
            document.getElementById('location').value = jobs[i].location;
            document.getElementById('category').value = jobs[i].category;
            document.getElementById('description').value = jobs[i].description;
            editId = id;
            window.scrollTo(0, 0);
        }
    }
}

function filter() {
    var search = document.getElementById('searchInput').value.toLowerCase();
    var cat = document.getElementById('categoryFilter').value;
    var all = document.querySelectorAll('article, .job-card');
    for (var i = 0; i < all.length; i++) {
        var show = (!search || all[i].textContent.toLowerCase().includes(search)) && (cat === 'all' || all[i].getAttribute('data-category') === cat);
        all[i].style.display = show ? '' : 'none';
    }
}

document.getElementById('searchInput').onkeyup = filter;
document.getElementById('categoryFilter').onchange = filter;