const domain = "https://www.huyvu.dk/";
const postsEndpointBlog = "wp-json/wp/v2/blog-post";
const getRealImageUrls = "?acf_format=standard";

const blogContainer = document.getElementById("blog-container");

async function fetchBlogs() {
  try {
    const response = await fetch(domain + postsEndpointBlog + getRealImageUrls);
    const blogIndlaeg = await response.json();

    console.log("Blog-indlæg hentet:", blogIndlaeg);

    blogIndlaeg.forEach((post) => {
      blogContainer.innerHTML += `
        <article class="blog-post borderRadius">        
        <a href="./blogIndlaegIteration.html?slug=${post.slug}">
        <img  src="${post.acf.billede.sizes.medium}" alt="">
        <div class="blog-content">
        <p>${post.acf["kategori-label"]} </p>
        <h4>${post.title.rendered}</h4>
        </div>
        <p class="blog-dato"><i class="fa-regular fa-calendar"></i> ${post.acf.dato}</p>
        </a>
        </article>
      `;
    });
  } catch (error) {
    console.error("Fejl ved hentning af blogs:", error);
    blogContainer.innerHTML = `<p>Kunne ikke hente blogindlæg.</p>`;
  }
}

fetchBlogs();
