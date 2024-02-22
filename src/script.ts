let loading: string = `
	<div class="loader">
		<div class="load"></div>
	</div>
`;

let blog_edit_id: number = 0;

function blogDelete(index: number): string | void {
	if (!confirm("Do you want to delete this blog?")) {
		return "error";
	}
	if ("blogs" in localStorage) {
		let blogs: any[] = JSON.parse(localStorage["blogs"]);
		if (blogs.length > index) {
			let title = blogs.splice(index, 1);
			window.alert(title[0].blog_title + " Deleted successfully");
			localStorage["blogs"] = JSON.stringify(blogs);
		}
	}
	loadBlogs();
}

function editBlog(): void {
	let blog_id: number = Number(form.blog_id.value);
	let blog_uid: string = form.blog_uid.value;
	let blog_title: string = form.blog_title.value;
	let blog_content: string = form.blog_content.value;
	let blog_cover: string = form.blog_cover.value;
	let blog_desc: string = form.blog_desc.value;
	if ("blogs" in localStorage) {
		let blogs: any[] = JSON.parse(localStorage["blogs"]);
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

function addBlog(): void {
	let blog_title: string = form.blog_title.value;
	let blog_content: string = form.blog_content.value;
	let blog_cover: string = form.blog_cover.value;
	let blog_desc: string = form.blog_desc.value;
	let date: Date = new Date();
	let time: number = date.getTime();
	if ("blogs" in localStorage && localStorage["blogs"].length > 3) {
		let blogs: any[] = JSON.parse(localStorage["blogs"]);
		let new_blog = {
			blog_title: blog_title,
			blog_content: blog_content,
			blog_desc: blog_desc,
			blog_cover: blog_cover,
			blog_id: time,
		};
		blogs.push(new_blog);
		localStorage["blogs"] = JSON.stringify(blogs);
	} else {
		let blogs: any[] = [];
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

function blogEdit(n: number): void {
	blog_edit_id = n;
	loader("editBlog");
}

function loadBlogs(): void {
	let bc: HTMLElement = document.getElementById("blogs");
	bc.innerHTML = "";
	let i: number = 0;
	if ("blogs" in localStorage) {
		let blogs: any[] = JSON.parse(localStorage["blogs"]);
		console.log(blogs.length);
		if (blogs.length == 0) {
			let content: string = `
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
		} else {
			blogs.forEach((element: any) => {
				let title: string = element.blog_title;
				let content: string = `
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
	} else {
		let content: string = `
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

function messageDelete(n: number): void {
	if ("messages" in localStorage) {
		if (localStorage["messages"].length > 3) {
			let messages: any[] = JSON.parse(localStorage["messages"]);
			if (
				messages.length > n &&
				confirm("Do you want to delete this message?")
			) {
				messages.splice(n, 1);
			}
			localStorage["messages"] = JSON.stringify(messages);
			loader("messages", 500);
		}
	}
}

function loadMessages(): void {
	if ("messages" in localStorage) {
		var container: HTMLElement = document.getElementById("message");
		if (localStorage["messages"].length > 3) {
			let messages: any[] = JSON.parse(localStorage["messages"]);
			var i: number = 0;
			container.innerHTML = "";
			messages.forEach((item) => {
				let message: string = `
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
		} else {
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

function projectDelete(n: number): void {
	if ("projects" in localStorage) {
		if (localStorage["projects"].length > 3) {
			let projects: any[] = JSON.parse(localStorage["projects"]);
			if (
				projects.length > n &&
				confirm("Do you want to delete this project?")
			) {
				projects.splice(n, 1);
			}
			localStorage["projects"] = JSON.stringify(projects);
			loader("projects", 500);
		}
	}
}

function addProject(): void {
	let project_name: string = form.project_name.value;
	let project_desc: string = form.project_desc.value;
	let project_cover: string = form.project_cover.value;
	let external_link: string = form.external_link.value;
	let newProject = {
		project_name: project_name,
		project_desc: project_desc,
		project_cover: project_cover,
		external_link: external_link,
	};
	if ("projects" in localStorage && localStorage["projects"].length > 3) {
		let projects: any[] = JSON.parse(localStorage["projects"]);
		projects.push(newProject);
		localStorage["projects"] = JSON.stringify(projects);
	} else {
		let projects: any[] = [];
		projects.push(newProject);
		localStorage["projects"] = JSON.stringify(projects);
	}
	loader("projects");
}

function loadProjects(): void {
	let container: HTMLElement = document.getElementById("projects");
	if ("projects" in localStorage) {
		if (localStorage["projects"].length > 3) {
			let projects: any[] = JSON.parse(localStorage["projects"]);
			var i: number = 0;
			container.innerHTML = "";
			projects.forEach((item: any) => {
				let project: string = `
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
		} else {
			container.innerHTML = `
				<tr>
					<td>No project yet</td>
					<td></td><td></td><td></td>
				</tr>
			`;
		}
	} else {
		container.innerHTML = `
				<tr>
					<td>No project yet</td>
					<td></td><td></td><td></td>
				</tr>
			`;
	}
}

// Load comments
function commentDelete(n: number): void {
	if ("comments" in localStorage) {
		if (localStorage["comments"].length > 3) {
			let comments: any[] = JSON.parse(localStorage["comments"]);
			if (
				comments.length > n &&
				confirm("Do you want to delete this comment?")
			) {
				comments.splice(n, 1);
			}
			localStorage["comments"] = JSON.stringify(comments);
			loader("comments", 500);
		}
	}
}
function commentToggle(n: number, message: string = "approve"): void {
	if ("comments" in localStorage) {
		if (localStorage["comments"].length > 3) {
			let comments: any[] = JSON.parse(localStorage["comments"]);
			if (
				comments.length > n &&
				confirm("Do you want to " + message + " this comment?")
			) {
				comments[n].approved = !comments[n].approved;
			}
			localStorage["comments"] = JSON.stringify(comments);
			loader("comments", 500);
		}
	}
}

function loadComments(): void {
	if ("comments" in localStorage && localStorage["comments"].length > 3) {
		let comments: any[] = JSON.parse(localStorage["comments"]);
		let container: HTMLElement = document.getElementById("comment");
		container.innerHTML = "";
		let i: number = 0;
		comments.forEach((comment) => {
			let blog_id: string = comment.blog_id;
			let blog_title: string = "";
			if ("blogs" in localStorage && localStorage["blogs"].length > 3) {
				let blogs: any[] = JSON.parse(localStorage["blogs"]);
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
			let item: string = `
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
						<button onclick="commentToggle(${i},${
				comment.approved ? "'deny'" : "'approve'"
			})">${comment.approved ? "Deny" : "Approve"}</button>
						<button onclick="commentDelete(${i})" class="delete">Delete</button>
					</td>
				</tr>
			`;
			container.innerHTML += item;
			i++;
		});
	} else {
		let container: HTMLElement = document.getElementById("comment");
		container.innerHTML = `
			<tr>
				<td>No comments yet</td>
			</tr>
		`;
	}
}
async function loader(page: string, timer: number = 1500): Promise<void> {
	let content: HTMLElement = document.getElementById("content");
	let pages: { [key: string]: string } = {
		about: "pages/about.html",
		blogs: "pages/blogs.html",
		newBlog: "pages/new-blog.html",
		editBlog: "pages/edit-blog.html",
		messages: "pages/messages.html",
		comments: "pages/comments.html",
		projects: "pages/projects.html",
		newProject: "pages/new-project.html",
	};
	let active: { [key: string]: string } = {
		about: "about",
		blogs: "blog",
		newBlog: "blog",
		editBlog: "blog",
		messages: "messages",
		comments: "comments",
		projects: "mywork",
		newProject: "mywork",
	};
	let all: NodeListOf<Element> = document.querySelectorAll(".link");
	all.forEach((item) => {
		item.classList.remove("active");
	});
	let al: HTMLElement = document.getElementById(active[page]);
	al.classList.add("active");
	let date: Date = new Date();
	let url: string = pages[page] + "?cache=" + date.getTime();
	let res: Response = await fetch(url);
	let ans: string = await res.text();
	content.innerHTML = loading;
	setTimeout(function () {
		content.innerHTML = ans;
		page == "blogs" ? loadBlogs() : 0;
		page == "messages" ? loadMessages() : 0;
		page == "comments" ? loadComments() : 0;
		page == "projects" ? loadProjects() : 0;
		if (page == "editBlog") {
			if ("blogs" in localStorage) {
				let blogs: any[] = JSON.parse(localStorage["blogs"]);
				if (blogs.length > blog_edit_id) {
					let blog_title: string = blogs[blog_edit_id].blog_title;
					let blog_cover: string = blogs[blog_edit_id].blog_cover;
					let blog_desc: string = blogs[blog_edit_id].blog_desc;
					let blog_content: string = blogs[blog_edit_id].blog_content;
					let blog_uid: string = blogs[blog_edit_id].blog_id;
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
}
