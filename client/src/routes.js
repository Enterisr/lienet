import Artic from './routes/Artic.svelte';
import Home from './routes/Home.svelte';
import Privacy from './routes/Privacy.svelte';

const routes = {
	'/privacy': Privacy,
	'/:id': Artic,
	'/#': Home,
	'/': Home,
	"*":Home
};
export default routes;
