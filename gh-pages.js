
import ghpages from 'gh-pages';

// IMPORTANT: Replace with your GitHub repository URL.
const REPO_URL = 'https://github.com/USERNAME/REPO_NAME.git'; 

console.log('Starting deployment to GitHub Pages...');

ghpages.publish(
  'dist', // The folder containing your built files
  {
    branch: 'gh-pages',
    repo: REPO_URL,
    dotfiles: true,
  },
  (err) => {
    if (err) {
      console.error('Deployment failed:', err);
    } else {
      console.log('Deployment complete! Your site is now live.');
      console.log('Note: You may need to configure your repository settings to use the "gh-pages" branch for GitHub Pages.');
    }
  }
);
