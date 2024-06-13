const links = `
  <a href="http://localhost:3000/first-page.html" id="link-1" class="rt-action-link">First Page</a>
  <a href="http://localhost:3000/second-page.html" id="link-2" class="rt-action-link">Second Page</a>
  <a href="http://localhost:3000/not-exist.html" id="link-page-not-exist" class="rt-action-link">Page Not Exist</a>
  <a href="" id="link-without-href" class="rt-action-link">Page without href</a>
  <a href="http://localhost:3000/page-without-content.html" id="link-page-without-content" class="rt-action-link">Page without content</a>
`;

const mockFirstPage = `
  ${links}

  <div id="rt-content">
    <div class="rt-el-animation">part 1</div>
    <div class="rt-el-animation">part 2</div>
    <div class="rt-el-animation">part 3</div>
    <div class="rt-el-animation">part 4</div>
    First Page Content...
  </div>
`;

const mockSecondPage = `
  ${links}

  <div id="rt-content">
    <div class="rt-el-animation">part 1</div>
    <div class="rt-el-animation">part 2</div>
    <div class="rt-el-animation">part 3</div>
    <div class="rt-el-animation">part 4</div>
    Second Page Content...
  </div>
`;

const mockPageWithoutContent = `
  ${links}

  <div>
    Page Without Content...
  </div>
`;

export { mockFirstPage, mockSecondPage, mockPageWithoutContent };
