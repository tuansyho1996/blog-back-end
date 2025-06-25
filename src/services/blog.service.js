import blogModel from '../models/model.blog.js';
import { BadRequestError } from '../core/error.response.js';
import slugify from 'slugify';

class BlogService {
    generateUniqueSlug = async (blogName) => {
        let baseSlug = slugify(blogName, { lower: true });
        let uniqueSlug = baseSlug;
        let counter = 1;

        while (await blogModel.exists({ blog_slug: uniqueSlug })) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        return uniqueSlug;
    }
    createBlog = async (data) => {
        // Logic to create a blog
        const slug = await this.generateUniqueSlug(data.blog_title);
        data.blog_slug = slug;
        const newBlog = await blogModel.create(data);
        if (!newBlog) {
            throw new BadRequestError('Error creating blog');
        }
        return newBlog;
    };
    getBlog = async (slug) => {
        // Logic to get all blogs
        if (slug === 'all') {
            const blogs = await blogModel.find();
            if (!blogs) {
                throw new BadRequestError('Error fetching blogs');
            }
            return blogs;
        } else {
            const blog = await blogModel.findOne({ blog_slug: slug });
            if (!blog) {
                throw new BadRequestError('Blog not found');
            }
            return blog;
        }
    };
    deleteBlog = async (id) => {
        // Logic to delete a blog
        const deletedBlog = await blogModel.findByIdAndDelete(id);
        if (!deletedBlog) {
            throw new BadRequestError('Error deleting blog');
        }
        return deletedBlog;
    };
    updateBlog = async (id, data) => {
        // Logic to update a blog
        const slug = await this.generateUniqueSlug(data.blog_title);
        data.blog_slug = slug;
        const updatedBlog = await blogModel.findByIdAndUpdate(id, data, { new: true });
        if (!updatedBlog) {
            throw new BadRequestError('Error updating blog');
        }
        return updatedBlog;
    }
}
export default new BlogService;