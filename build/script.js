"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let loading = `
	<div class="loader">
		<div class="load"></div>
	</div>
`;
let blog_edit_id = 0;
function blogDelete(index) {
    if (!confirm("Do you want to delete this blog?")) {
        return "error";
    }
    if ("blogs" in localStorage) {
        let blogs = JSON.parse(localStorage["blogs"]);
        if (blogs.length > index) {
            let title = blogs.splice(index, 1);
            window.alert(title[0].blog_title + " Deleted successfully");
            localStorage["blogs"] = JSON.stringify(blogs);
        }
    }
    loadBlogs();
}
function editBlog() {
    let blog_id = Number(form.blog_id.value);
    let blog_uid = form.blog_uid.value;
    let blog_title = form.blog_title.value;
    let blog_content = form.blog_content.value;
    let blog_cover = form.blog_cover.value;
    let blog_desc = form.blog_desc.value;
    if ("blogs" in localStorage) {
        let blogs = JSON.parse(localStorage["blogs"]);
        let new_blog = {
            blog_title: blog_title,
            blog_content: blog_content,
            blog_desc: blog_desc,
            blog_cover: blog_cover,
            blog_id: blog_uid,
        };
        blogs[blog_id] = new_blog;
        localStorage["blogs"] = JSON.stringify(blogs);
    }
    loader("blogs");
}
function addBlog() {
    let blog_title = form.blog_title.value;
    let blog_content = form.blog_content.value;
    let blog_cover = form.blog_cover.value;
    let blog_desc = form.blog_desc.value;
    let date = new Date();
    let time = date.getTime();
    if ("blogs" in localStorage && localStorage["blogs"].length > 3) {
        let blogs = JSON.parse(localStorage["blogs"]);
        let new_blog = {
            blog_title: blog_title,
            blog_content: blog_content,
            blog_desc: blog_desc,
            blog_cover: blog_cover,
            blog_id: time,
        };
        blogs.push(new_blog);
        localStorage["blogs"] = JSON.stringify(blogs);
    }
    else {
        let blogs = [];
        blogs[0] = {
            blog_title: blog_title,
            blog_content: blog_content,
            blog_desc: blog_desc,
            blog_cover: blog_cover,
            blog_id: time,
        };
        localStorage["blogs"] = JSON.stringify(blogs);
    }
    loader("blogs");
}
function blogEdit(n) {
    blog_edit_id = n;
    loader("editBlog");
}
function loadBlogs() {
    let bc = document.getElementById("blogs");
    bc.innerHTML = "";
    let i = 0;
    if ("blogs" in localStorage) {
        let blogs = JSON.parse(localStorage["blogs"]);
        console.log(blogs.length);
        if (blogs.length == 0) {
            let content = `
				<tr>
					<td>No blogs Found</td>
					<td>0</td>
					<td class="actions">
						<button 
							class="buttons" 
							onclick="loader('newBlog')">
							<i class="fa fa-plus"></i> New article</button>
					</td>
				</tr>
			`;
            bc.innerHTML += content;
        }
        else {
            blogs.forEach((element) => {
                let title = element.blog_title;
                let content = `
					<tr>
						<td>${title}</td>
						<td>0</td>
						<td class="actions">
							<button onclick="blogEdit(${i})">Edit</button>
							<button class="delete" onclick="blogDelete(${i})">Delete</button>
						</td>
					</tr>
				`;
                bc.innerHTML += content;
                i++;
            });
        }
    }
    else {
        let content = `
		<tr>
			<td>No blogs Found</td>
			<td>0</td>
			<td class="actions">
				<button class="buttons" onclick="loader('newBlog')"><i class="fa fa-plus"></i> New article</button>
			</td>
		</tr>
	`;
        bc.innerHTML += content;
    }
}
// Load Messages
function messageDelete(n) {
    if ("messages" in localStorage) {
        if (localStorage["messages"].length > 3) {
            let messages = JSON.parse(localStorage["messages"]);
            if (messages.length > n &&
                confirm("Do you want to delete this message?")) {
                messages.splice(n, 1);
            }
            localStorage["messages"] = JSON.stringify(messages);
            loader("messages", 500);
        }
    }
}
function loadMessages() {
    if ("messages" in localStorage) {
        var container = document.getElementById("message");
        if (localStorage["messages"].length > 3) {
            let messages = JSON.parse(localStorage["messages"]);
            var i = 0;
            container.innerHTML = "";
            messages.forEach((item) => {
                let message = `
					<tr>
						<td>
							${item.name}
						</td>
						<td>
							${item.email}
						</td>
						<td>
							${item.message}
						</td>
						<td class="actions">
							<button onclick="messageDelete(${i})" class="delete">Delete</button>
						</td>
					</tr>
				`;
                container.innerHTML += message;
                i++;
            });
        }
        else {
            container.innerHTML = `
				<tr>
					<td>Bro, Nothing is here</td>
					<td></td><td></td><td></td>
				</tr>
			`;
        }
    }
}
// Load projects
function projectDelete(n) {
    if ("projects" in localStorage) {
        if (localStorage["projects"].length > 3) {
            let projects = JSON.parse(localStorage["projects"]);
            if (projects.length > n &&
                confirm("Do you want to delete this project?")) {
                projects.splice(n, 1);
            }
            localStorage["projects"] = JSON.stringify(projects);
            loader("projects", 500);
        }
    }
}
function addProject() {
    let project_name = form.project_name.value;
    let project_desc = form.project_desc.value;
    let project_cover = form.project_cover.value;
    let external_link = form.external_link.value;
    let newProject = {
        project_name: project_name,
        project_desc: project_desc,
        project_cover: project_cover,
        external_link: external_link,
    };
    if ("projects" in localStorage && localStorage["projects"].length > 3) {
        let projects = JSON.parse(localStorage["projects"]);
        projects.push(newProject);
        localStorage["projects"] = JSON.stringify(projects);
    }
    else {
        let projects = [];
        projects.push(newProject);
        localStorage["projects"] = JSON.stringify(projects);
    }
    loader("projects");
}
function loadProjects() {
    let container = document.getElementById("projects");
    if ("projects" in localStorage) {
        if (localStorage["projects"].length > 3) {
            let projects = JSON.parse(localStorage["projects"]);
            var i = 0;
            container.innerHTML = "";
            projects.forEach((item) => {
                let project = `
					<tr>
						<td>
							${item.project_name}
						</td>
						<td>
							<a href="${item.external_link}" target="_blank">${item.external_link}</a>
						</td>
						<td class="actions">
							<button onclick="projectDelete(${i})" class="delete">Delete</button>
						</td>
					</tr>
				`;
                container.innerHTML += project;
                i++;
            });
        }
        else {
            container.innerHTML = `
				<tr>
					<td>No project yet</td>
					<td></td><td></td><td></td>
				</tr>
			`;
        }
    }
    else {
        container.innerHTML = `
				<tr>
					<td>No project yet</td>
					<td></td><td></td><td></td>
				</tr>
			`;
    }
}
// Load comments
function commentDelete(n) {
    if ("comments" in localStorage) {
        if (localStorage["comments"].length > 3) {
            let comments = JSON.parse(localStorage["comments"]);
            if (comments.length > n &&
                confirm("Do you want to delete this comment?")) {
                comments.splice(n, 1);
            }
            localStorage["comments"] = JSON.stringify(comments);
            loader("comments", 500);
        }
    }
}
function commentToggle(n, message = "approve") {
    if ("comments" in localStorage) {
        if (localStorage["comments"].length > 3) {
            let comments = JSON.parse(localStorage["comments"]);
            if (comments.length > n &&
                confirm("Do you want to " + message + " this comment?")) {
                comments[n].approved = !comments[n].approved;
            }
            localStorage["comments"] = JSON.stringify(comments);
            loader("comments", 500);
        }
    }
}
function loadComments() {
    if ("comments" in localStorage && localStorage["comments"].length > 3) {
        let comments = JSON.parse(localStorage["comments"]);
        let container = document.getElementById("comment");
        container.innerHTML = "";
        let i = 0;
        comments.forEach((comment) => {
            let blog_id = comment.blog_id;
            let blog_title = "";
            if ("blogs" in localStorage && localStorage["blogs"].length > 3) {
                let blogs = JSON.parse(localStorage["blogs"]);
                blogs.forEach((blog) => {
                    if (blog.blog_id == blog_id) {
                        blog_title = blog.blog_title;
                        return;
                    }
                });
            }
            if (blog_title == "") {
                blog_title = "Blog is missing";
            }
            let item = `
				<tr>
					<td>
					<i 
						class="${comment.approved ? "greener" : "red"} 
						fa fa-${comment.approved ? "check" : "x"}"></i> ${comment.name}
						<br>
						<br>
						<strong>On:</strong> ${blog_title}
					</td>
					<td>${comment.comment}</td>
					<td class="actions">
						<button onclick="commentToggle(${i},${comment.approved ? "'deny'" : "'approve'"})">${comment.approved ? "Deny" : "Approve"}</button>
						<button onclick="commentDelete(${i})" class="delete">Delete</button>
					</td>
				</tr>
			`;
            container.innerHTML += item;
            i++;
        });
    }
    else {
        let container = document.getElementById("comment");
        container.innerHTML = `
			<tr>
				<td>No comments yet</td>
			</tr>
		`;
    }
}
function loader(page, timer = 1500) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = document.getElementById("content");
        let pages = {
            about: "pages/about.html",
            blogs: "pages/blogs.html",
            newBlog: "pages/new-blog.html",
            editBlog: "pages/edit-blog.html",
            messages: "pages/messages.html",
            comments: "pages/comments.html",
            projects: "pages/projects.html",
            newProject: "pages/new-project.html",
        };
        let active = {
            about: "about",
            blogs: "blog",
            newBlog: "blog",
            editBlog: "blog",
            messages: "messages",
            comments: "comments",
            projects: "mywork",
            newProject: "mywork",
        };
        let all = document.querySelectorAll(".link");
        all.forEach((item) => {
            item.classList.remove("active");
        });
        let al = document.getElementById(active[page]);
        al.classList.add("active");
        let date = new Date();
        let url = pages[page] + "?cache=" + date.getTime();
        let res = yield fetch(url);
        let ans = yield res.text();
        content.innerHTML = loading;
        setTimeout(function () {
            content.innerHTML = ans;
            page == "blogs" ? loadBlogs() : 0;
            page == "messages" ? loadMessages() : 0;
            page == "comments" ? loadComments() : 0;
            page == "projects" ? loadProjects() : 0;
            if (page == "editBlog") {
                if ("blogs" in localStorage) {
                    let blogs = JSON.parse(localStorage["blogs"]);
                    if (blogs.length > blog_edit_id) {
                        let blog_title = blogs[blog_edit_id].blog_title;
                        let blog_cover = blogs[blog_edit_id].blog_cover;
                        let blog_desc = blogs[blog_edit_id].blog_desc;
                        let blog_content = blogs[blog_edit_id].blog_content;
                        let blog_uid = blogs[blog_edit_id].blog_id;
                        form.blog_title.innerHTML = blog_title;
                        form.blog_content.innerHTML = blog_content;
                        form.blog_id.value = blog_edit_id.toString();
                        form.blog_uid.value = blog_uid;
                        form.blog_desc.innerHTML = blog_desc;
                        form.blog_cover.value = blog_cover;
                    }
                }
            }
        }, timer);
    });
}
