'use client';

import React from 'react';
import Image from 'next/image';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  slug: string;
};

const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Science Behind Our Immunity Blend',
    excerpt: 'Discover how our carefully selected ingredients work together to support your body\'s natural defense system.',
    image: '/images/blog-immunity.jpg',
    date: 'May 12, 2023',
    slug: '/blog/immunity-blend-science'
  },
  {
    id: 'post-2',
    title: '5 Ways To Incorporate Wellness Shots Into Your Routine',
    excerpt: 'Simple ways to make wellness shots a seamless part of your daily health regimen.',
    image: '/images/blog-routine.jpg',
    date: 'April 28, 2023',
    slug: '/blog/wellness-shots-routine'
  },
  {
    id: 'post-3',
    title: 'The Benefits of Cold-Pressed Ingredients',
    excerpt: 'Why our cold-press method preserves more nutrients and delivers superior benefits.',
    image: '/images/blog-cold-pressed.jpg',
    date: 'April 10, 2023',
    slug: '/blog/cold-pressed-benefits'
  }
];

const BlogSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <h2 className="section-title">Latest News</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="group">
              <a href={post.slug} className="block" aria-label={`Read ${post.title}`}>
                <div className="mb-4 overflow-hidden rounded-lg">
                  <div className="relative h-60 w-full">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill={true}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-brand-brown mb-2">{post.date}</p>
                  <h3 className="text-lg font-medium text-brand-dark mb-2 group-hover:text-brand-brown transition-colors">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                  <span className="text-sm font-medium text-brand-brown border-b border-transparent group-hover:border-brand-brown transition-colors">
                    Read More
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="/blog" className="btn-outline" aria-label="View all blog posts">
            View All Posts
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 