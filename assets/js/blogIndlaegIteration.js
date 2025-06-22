const domain3 = "https://www.huyvu.dk/";
const postsEndpointBlog3 = "wp-json/wp/v2/blog-post";
const getRealImageUrls3 = "?acf_format=standard";

const blogIndlaegContainer = document.querySelector(".blogIndlaegIteration")



async function fetchBlogIndlaeg() {
    try {
        const response = await fetch(domain3 + postsEndpointBlog3 + getRealImageUrls3);
        const blogIndlaeg = await response.json();
        return blogIndlaeg;
    } catch (error) {
        console.error("Fejl ved hentning af blogindlæg:", error);
    }
}

function renderBlogIndlaeg(blogIndlaeg){
blogIndlaegContainer.innerHTML = "";
blogIndlaeg.forEach((indLaeg) => {
    blogIndlaegContainer.innerHTML += `
    <section> 
    <h1>${indLaeg.title.rendered}</h1>
    <img src="${indLaeg.acf.billede.sizes.large}" alt="">
    <p>${indLaeg.acf.beskrivelse}</p>
    </section>
    `
}
)}

async function initBlogIndlaeg(){
try {
    const blogIndlaeg = await fetchBlogIndlaeg();
    
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    const selectedIndLaeg = blogIndlaeg.find(indLaeg => indLaeg.slug === slug);
    console.log(selectedIndLaeg);

    renderBlogIndlaeg([selectedIndLaeg]);
} catch (error) {
    console.error("Fejl ved at finde blogindlægs", error);
}    
}

initBlogIndlaeg();