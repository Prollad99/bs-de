document.addEventListener("DOMContentLoaded", function() {
  let isLoading = false;
  let nextPageUrl = document.getElementById('pagination-data')?.dataset.nextPage;
  const postsContainer = document.getElementById('posts-container');
  const skeletonTemplate = document.getElementById('skeleton-template');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading && nextPageUrl) {
        loadNextPage();
      }
    });
  }, { threshold: 0.1 });

  function showSkeleton() {
    const skeleton = skeletonTemplate.content.cloneNode(true);
    postsContainer.appendChild(skeleton);
  }

  function removeSkeleton() {
    const skeletons = postsContainer.querySelectorAll('.skeleton-image, .skeleton-button, .skeleton-title, .skeleton-text');
    skeletons.forEach(skeleton => {
      skeleton.closest('.col-md-6').remove();
    });
  }

  async function loadNextPage() {
    if (!nextPageUrl || isLoading) return;
    
    isLoading = true;
    showSkeleton();
    
    try {
      const response = await fetch(nextPageUrl);
      const html = await response.text();
      const parser = new DOMParser();
      const nextPageDoc = parser.parseFromString(html, 'text/html');

      const newPosts = nextPageDoc.querySelectorAll('#posts-container > .col-md-6');
      const newPagination = nextPageDoc.getElementById('pagination-data');

      removeSkeleton();

      newPosts.forEach(post => {
        post.style.opacity = '0';
        postsContainer.appendChild(post);
        setTimeout(() => post.style.opacity = '1', 50);
      });

      nextPageUrl = newPagination?.dataset.nextPage;
      if (!nextPageUrl) observer.disconnect();

    } catch (error) {
      console.error('Error loading next page:', error);
      removeSkeleton();
    }
    
    isLoading = false;
  }

  // Observe the last post element for intersection
  if (postsContainer.children.length > 0) {
    observer.observe(postsContainer.lastElementChild);
  }

  // Re-observe when new elements are added
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      if (postsContainer.children.length > 0) {
        observer.observe(postsContainer.lastElementChild);
      }
    });
  });

  mutationObserver.observe(postsContainer, { childList: true });
});