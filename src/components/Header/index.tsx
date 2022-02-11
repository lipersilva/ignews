import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';


export function Header (){
  
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />

        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            {/* condicional para mostrar o link ativo ( barrinha amarela ) */}
            {/* <a  className={asPath === '/' ? styles.active : ''}>Home</a> */}
            <a>Home</a> 
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            {/* <a className={asPath === '/post' ? styles.active : ''}>Posts</a> */}
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton/>
      </div>
    </header>
  );
}