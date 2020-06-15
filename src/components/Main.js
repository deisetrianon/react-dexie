import React , {useState, useEffect} from 'react';
import db from '../db';

const Main = () => {
    const [postTitle, setTitle] = useState("");
    const [postContent, setContent] = useState("");
    const [postFile, setFile] = useState("");
    const [posts, setPosts] = useState("");

    db.open().catch((err) => {
        console.log(err.stack || err)
    });

    useEffect(() => {
        const getPosts = async() => {
            let allPosts = await db.posts.toArray();
            setPosts(allPosts);
        }
        getPosts();
    }, []);

    const getFile = (e) => {
        let reader = new FileReader();
        reader.readAsDataURL(e[0]);
        reader.onload = e => {
            setFile(reader.result);
        }
    };

    const deletePost = async(id) => {
        db.posts.delete(id);
        const allPosts = await db.posts.toArray();
        setPosts(allPosts);
    };

    const getPostInfo = (e) => {
        e.preventDefault();
        if (postTitle !== "" && postContent !== "" && postFile !== "") {
            const post = {
                title: postTitle,
                content: postContent,
                file: postFile
            }

            db.posts.add(post).then(async() => {
                const allPosts = await db.posts.toArray();
                setPosts(allPosts);
            });
        }
    };

    const getPostTemplate = ({ title, content, file }) => (
        <div className="post" key={title}>
            <div style={{backgroundImage: "url(" + file + ")" }} />
            <h2>{title}</h2>
            <p>{content}</p>
            <button className="delete" onClick={() => deletePost(title)}>Delete</button>
        </div>
    );

    const getEmptyStateTemplate = () => (
        <div className="message">
            <p>There are no posts to show</p>
        </div>
    );

    const getPostSectionContent = () => {
        return posts.length > 0
            ? (
                <div className="postsContainer">
                    {posts.map(post => getPostTemplate(post))}
                </div>
            )
            : getEmptyStateTemplate()
    };

    return (
        <>
            <form onSubmit={getPostInfo}>
                <div className="control">
                    <label>Title</label>
                    <input type="text" name="title"  onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="control">
                    <label>Content</label>
                    <textarea name="content"  onChange={e => setContent(e.target.value)} />
                </div>
                <div className="control">
                    <label>File</label>
                    <label htmlFor="cover" className="cover">Choose a file</label>
                    <input type="file" id="cover" name="file"  onChange={e => getFile(e.target.files)} />
                </div>
                <input type="submit" value="Submit" />
            </form>

            {getPostSectionContent()}
        </>
    );
};

export default Main;
