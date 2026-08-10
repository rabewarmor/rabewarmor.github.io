

function renderItems(list, containerId) {
  const container = document.getElementById(containerId);
  list.forEach(entry => {
    // build .item-top (title + date) and <ul> of bullets
    // append to container
  });
}


renderItems(experience, "experience-list");
renderItems(projects, "projects-list");
renderItems(education, "education-list");
