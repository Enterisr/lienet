import Artic from './routes/Artic.svelte';
import Home from './routes/Home.svelte';

const routes = {
	'/:id': Artic,
	'/': Home,
	'/#': Home
};
export default routes;
