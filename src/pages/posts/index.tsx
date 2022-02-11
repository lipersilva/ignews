import styles from './styles.module.scss'
import Head from 'next/head'
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic'
import {GetStaticProps} from 'next';
import {RichText} from 'prismic-dom';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps{
  posts: Post[]
}
export default function Posts({ posts } : PostsProps) {
  return (
    <>
      <Head>
        <title> Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <a key={post.slug} href="#"> 
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>        
          )) }
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.predicates.at('document.type','posts')
  ], {
    fetch: ['posts.title','posts.content'],
    pageSize: 100,
  })
  
  const posts = response.results.map(post => {
    return {
      slugs: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type ==='paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })

    };
  });
  //console.log(response) //debugger
  //console.log(JSON.stringify(response,null,2)) //debugger para visualizar valores dentro de []
  return {
    props: {
      posts
    }
  }
}