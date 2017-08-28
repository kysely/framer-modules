import Store from 'electron-store'

const config = new Store({
    defaults: {
        presets: [],
        openPrototype: null,
        offeredPrototypes: [],
    }
})

export default config


/*  Presets stored in following format:

	[
		{
			name: 'Company UI Starter Pack',
			modules: [
				{ name: 'Class Animation', unique_name: 'class-animation' },
				{ name: 'InputLayer', unique_name: 'inputlayer' }
			]
		},
		{
			name: 'Apple UI Kit',
			modules: [
				{ name: 'InputLayer', unique_name: 'inputlayer' },
				{ name: 'Awesome Module', unique_name: 'awesome-module' }
			]
		}
	]
*/
