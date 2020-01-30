import Artic from './routes/Artic.svelte';
import Home from './routes/Home.svelte';
import Privacy from './routes/Privacy.svelte';
import About from './routes/About.svelte';

const routes = {
	'/privacy': Privacy,
	'/about': About,
	'/:id': Artic,
	'/#': Home,
	'/': Home,
	'*': Home
};
export default routes;
