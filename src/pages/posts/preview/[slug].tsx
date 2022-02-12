import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from '../post.module.scss'


interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const {data : session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if(session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])
  
  return(
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={`${styles.postContent} ${styles.previewContent}`} //duas classes
            dangerouslySetInnerHTML={{ __html:post.content}}
          >
          </div>
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/"> 
              <a href="#">Subscribe now 🤗</a>
            </Link>

          </div>
        </article>

      </main>
    
    </>
  );
}

//retorna quais previews de posts quer gerar durante a build
export const getStaticPaths = () => {
  return {
    paths: [], //carregar todos os posts conforme primeiro acesso
    fallback: 'blocking' //true || false || blocking
  }
}


export const getStaticProps : GetStaticProps = async({ params }) => {
  const { slug } = params;
  //console.log(session)
  const prismic = getPrismicClient()
  const response = await prismic.getByUID<any>('posts', String(slug), {} )
  //console.log(response);
  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),//função splice, para mostrar apenas as 3 primeiras linhas do conteudo
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR',{
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

  }

  return {
    props: {
      post,
    },
    //sempre que utilizado o getStaticProps, é legal colocar o REDIRECT
    redirect: 60 * 30, //30 minutes
  }
  
}