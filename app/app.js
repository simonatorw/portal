// agGrid.LicenseManager.setLicenseKey("McKesson_Corporation_3Devs_19-Apr-2016_MTQ5MjU1NjQwMDAwMA==2497523f81d2b18a2e0dd38332f488f5");
agGrid.initialiseAgGridWithAngular1(angular);

angular.module('portalMod', [
	'ui.router', 
	'agGrid',
	'sharedMod',
	'carouselMod',
	'tabsMod',
	'homeMod',
	'gridMod',
	'pillsMod',
	'tableMod',
	'faveMod',
	'infoBoardMod',
	'advSearchMod',
	'formMod',
	'previewMod'
	])
	.value('localFlag', false)
	.constant('VIEW_PATH', {
		TABS: 'bin/tabs/tabs.html',
		FOOTER: 'bin/footer.html'
	})
	.constant('APP', {
		DATA_PATH: {
			USER: '../angds.php?user=now',
			USER_LOCAL: 'resource/user.json',
			MENU: '../angds.php?data_navigation=now',
			MENU_LOCAL: 'resource/menu.json',
			MENU_SERV: '../angds.php?services_navigation=now',
			MENU_SERV_LOCAL: 'menu_serv.json',
			REPORT: '../angds.php?{id}={value}',
			REPORT_LOCAL: '',
			SEARCH: '../angds.php?term={term}',
			SEARCH_LOCAL: 'resource/search-{term}.json',
			FOOTER: '../angds.php?footer=all'
		},
		LOGOUT: '../angds.php?logout=now'
	})
	.constant('STATES', {
		HOME: 'home',
		GRID: 'grid',
		PILLS: 'pills',
		PILLS_CHILD: 'pills.content',
		REPORT: 'report',
		ADV_SEARCH: 'advSearch',
		FORM: 'form',
		PREVIEW: 'preview'
	})
	.config(['$stateProvider', '$urlRouterProvider', 'stateInitSrvProvider', 'STATES', '$httpProvider', 
		function($stateProvider, $urlRouterProvider, stateInitSrvProvider, STATES, $httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state(STATES.HOME, stateInitSrvProvider.getConfig(STATES.HOME))
			.state(STATES.GRID, stateInitSrvProvider.getConfig(STATES.GRID, ['id', 'label', 'cache']))
			.state(STATES.PILLS, stateInitSrvProvider.getConfig(STATES.PILLS, ['id', 'label', 'cache']))
			.state(STATES.PILLS_CHILD, stateInitSrvProvider.getConfig(STATES.PILLS_CHILD, ['pid']))
			.state(STATES.ADV_SEARCH, stateInitSrvProvider.getConfig(STATES.ADV_SEARCH, ['panel']))
			.state(STATES.FORM, stateInitSrvProvider.getConfig(STATES.FORM, ['id', 'label', 'cache']))
			.state(STATES.PREVIEW, stateInitSrvProvider.getConfig(STATES.PREVIEW, ['id', 'label', 'cache']));

		if (!$httpProvider.defaults.headers.get) {
			$httpProvider.defaults.headers.get = {}; 
		}

		$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	}])
	.run(['INFO_BOARD', 'TABS', 'GRID', 'PILLS', 'APP', 'FAVE', 'utilSrv', 'localFlag', 'VIEW_PATH', '$rootScope', 'STATES', 'tabsSrv', 'mainSrv', '$window', 
		function(INFO_BOARD, TABS, GRID, PILLS, APP, FAVE, utilSrv, localFlag, VIEW_PATH, $rootScope, STATES, tabsSrv, mainSrv, $window) {
		
		utilSrv.setLocalData(localFlag, [INFO_BOARD, TABS, GRID, PILLS, APP]);	
		//mainSrv.doPost(TABS.DATA_PATH.TABS_SAVE, { tabs: '[{"data_id":"sla_all","param_value":"now","page_type":"grid","label":"All Applications","disable":false}]' });
		tabsSrv.initTabs();

		$rootScope.VIEW_PATH = {
			TABS: VIEW_PATH.TABS,
			FAVE: FAVE.VIEW_PATH.FAVE,
			FOOTER: VIEW_PATH.FOOTER,
			INFO_BOARD: INFO_BOARD.VIEW_PATH.INFO_BOARD
		};

		$rootScope.STATES = {
			HOME: STATES.HOME,
			PILLS_CHILD: STATES.PILLS_CHILD
		};
		
		$rootScope.app = {
			importCsv: {}
		};
		
		/*
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			var url = $window.location.hash;
			if (url.indexOf(',,') + 1) {
				tabsSrv.setTabs(tabsSrv.urlToMenu(url));
			}
		});*/

		//$rootScope.app.showSuccess = true;
	}]);