document.addEventListener("DOMContentLoaded", function () {
    let isFetching = false;
    let nextPage = document.querySelector("#pagination-data")?.getAttribute("data-next-page");
    const postsContainer = document.getElementById("posts-container");
    const skeletonLoader = document.getElementById("skeleton-loader");

    function loadMorePosts() {
      if (!nextPage || isFetching) return;

      isFetching = true;

      // Show skeleton loaders
      skeletonLoader.style.display = "flex";
      const loaderClone = skeletonLoader.cloneNode(true);
      loaderClone.id = "";
      postsContainer.appendChild(loaderClone);

      fetch(nextPage)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // Get new posts and append them
          const newPosts = doc.querySelectorAll(".col-md-6");
          newPosts.forEach(post => {
            post.style.opacity = "0";
            post.style.transition = "opacity 0.5s ease-in-out";
            postsContainer.appendChild(post);
            setTimeout(() => { post.style.opacity = "1"; }, 50);
          });

          // Remove skeleton loader
          loaderClone.remove();

          // Update nextPage with the new page path
          nextPage = doc.querySelector("#pagination-data")?.getAttribute("data-next-page");

          if (!nextPage) {
            window.removeEventListener("scroll", handleScroll);
          }

          isFetching = false;
        })
        .catch(error => {
          console.error("Error loading more posts:", error);
          isFetching = false;
        });
    }

    function handleScroll() {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;

      if (scrollPosition >= documentHeight - 200) {
        loadMorePosts();
      }
    }

    if (nextPage) {
      window.addEventListener("scroll", handleScroll);
    }
  });