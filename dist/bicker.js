(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

routeViewFactory.$inject = ["$log", "$compile", "$controller", "ViewBindings", "$q", "State", "$rootScope", "$animate", "$timeout", "$injector", "PendingViewCounter", "PermissionDeniedError", "$templateRequest", "Route"];
routeOnClickFactory.$inject = ["Route", "$location", "$window", "$timeout"];
routeHrefFactory.$inject = ["Route", "$location", "$timeout"];
routeClassFactory.$inject = ["Route"];
var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

angular.module('bicker_router', ['ngAnimate']).run(["State", "Route", "$location", "$rootScope", "ObjectHelper", "PendingViewCounter", function (State, Route, $location, $rootScope, ObjectHelper, PendingViewCounter) {
  "ngInject";

  var oldUrl = undefined;
  $rootScope.$on('$locationChangeStart', function () {
    if (Route.isReady()) {
      Route.setReady(false);
    }
  });

  $rootScope.$on('$locationChangeSuccess', function (e, newUrl) {
    // Work-around for AngularJS issue https://github.com/angular/angular.js/issues/8368
    var data = void 0;
    if (newUrl === oldUrl) {
      return;
    }

    oldUrl = newUrl;

    PendingViewCounter.reset();
    var match = Route.match($location.path());

    if (!match) {
      data = {};
    } else {
      data = Route.extractData(match);
    }

    var fieldsToUnset = ObjectHelper.notIn(State.list, data);
    fieldsToUnset = _.difference(fieldsToUnset, Route.getPersistentStates().concat(Route.getFlashStates()));

    var eventData = { unsetting: fieldsToUnset, setting: data };
    $rootScope.$emit('bicker_router.beforeStateChange', eventData);

    if (eventData.unsetting.length !== 0) {
      State.unset(eventData.unsetting);
    }

    _.forEach(eventData.setting, function (value, key) {
      State.set(key, value);
    });

    Route.resetFlashStates();
    Route.setReady(true);
  });
}]);

angular.module('bicker_router').constant('ObjectHelper', {
  get: function get(object, path) {
    if (path === '') {
      return object;
    }
    var pieces = path.split('.');
    var key = pieces.pop();
    var parent = object;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = pieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var segment = _step.value;

        parent = parent[segment];
        if (parent === undefined) {
          return undefined;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return parent[key];
  },
  set: function set(object, path, value) {
    var pieces = path.split('.');
    var key = pieces.pop();
    var parent = object;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = pieces[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var segment = _step2.value;

        if (parent[segment] === undefined) {
          parent[segment] = {};
        }

        parent = parent[segment];
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return parent[key] = value;
  },
  unset: function unset(object, path) {
    if (path === '') {
      return object;
    }
    var pieces = path.split('.');
    var key = pieces.pop();
    var parent = object;

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = pieces[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var segment = _step3.value;

        parent = parent[segment];
        if (parent === undefined) {
          return false;
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (parent[key] === undefined) {
      return false;
    }
    delete parent[key];
    return true;
  },

  // Recursively return the properties in a that aren't in b
  notIn: function notIn(a, b) {
    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var notIn = [];
    prefix = prefix.length > 0 ? prefix + '.' : '';

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = Array.from(Object.keys(a))[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var key = _step4.value;

        var thisPath = '' + prefix + key;

        if (b[key] === undefined) {
          notIn.push(thisPath);
        } else if (_typeof(a[key]) === 'object' && !(a[key] instanceof Array)) {
          notIn = notIn.concat(this.notIn(a[key], b[key], thisPath));
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    return notIn;
  },
  default: function _default(overrides) {
    var defaultSet = void 0,
        value = void 0;
    var result = {};

    for (var _len = arguments.length, defaultSets = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      defaultSets[_key - 1] = arguments[_key];
    }

    if (defaultSets.length === 1) {
      defaultSet = defaultSets[0];
    } else {
      defaultSet = this.default.apply(this, _toConsumableArray(Array.from(defaultSets || [])));
    }

    for (var key in defaultSet) {
      value = defaultSet[key];
      if (value instanceof Array) {
        result[key] = overrides[key] || value;
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object" && _typeof(overrides[key]) === "object") {
        result[key] = this.default(overrides[key], value);
      } else {
        result[key] = overrides[key] || value;
      }
    }

    for (var _key2 in overrides) {
      value = overrides[_key2];
      result[_key2] = result[_key2] || value;
    }

    return result;
  }
});

angular.module('bicker_router').constant('PermissionDeniedError', Symbol('PermissionDeniedError'));

// Usage:
//
// If you want to add the class "active" to an anchor element when the "main" view has a binding
// with the name "myBinding" rendered within it
//
// <a route-class="{ className: 'active', viewName: 'main', bindingName: 'myBinding' }">Anchor text</a>
//
// You can also use regular expressions for the binding name, but to do so you have to provide a method
// on your controller which returns the route class definition object, because AngularJS expressions
// don't support inline regular expressions
//
// class MyController {
//  getRouteClassObject() {
//    return { className: 'active', viewName: 'main', bindingName: /myBind/ }
//  }
// }
//
// <a route-class="$ctrl.getRouteClassObject()">Anchor text</a>
//

function routeClassFactory(Route) {
  'ngInject';

  return {
    restrict: 'A',
    link: function link(scope, iElement, iAttrs) {
      scope.$watch(function () {
        var routeClassDefinition = scope.$eval(iAttrs['routeClass']);

        if (!Route.matchesCurrentBindingName(routeClassDefinition.viewName, routeClassDefinition.bindingName)) {
          if (iElement.hasClass(routeClassDefinition.className)) {
            iElement.removeClass(routeClassDefinition.className);
          }
        } else if (!iElement.hasClass(routeClassDefinition.className)) {
          iElement.addClass(routeClassDefinition.className);
        }
      });
    }
  };
}

angular.module('bicker_router').directive('routeClass', routeClassFactory);

function routeHrefFactory(Route, $location, $timeout) {
  'ngInject';

  return {
    restrict: 'A',
    scope: true,
    link: function link(scope, iElement, iAttrs) {
      if (iAttrs.ignoreHref === undefined && Route.isHtml5ModeEnabled()) {
        iElement.click(function (event) {
          event.preventDefault();
          var urlPath = iElement.attr('href').replace(/^#/, '');
          return $timeout(function () {
            return $location.url(urlPath);
          });
        });
      }

      var object = Route.getUrlWriters();
      for (var writerName in object) {
        var writer = object[writerName];
        scope[writerName + 'UrlWriter'] = writer;
      }

      return scope.$watch(iAttrs.routeHref, function (newUrl) {
        var url = void 0;
        if (Route.isHtml5ModeEnabled()) {
          url = newUrl;
        } else {
          url = '#' + newUrl;
        }
        return iElement.attr('href', url);
      });
    }
  };
}

angular.module('bicker_router').directive('routeHref', routeHrefFactory);

function routeOnClickFactory(Route, $location, $window, $timeout) {
  'ngInject';

  return {
    restrict: 'A',

    link: function link(scope, element, attrs) {
      var LEFT_BUTTON = 0;
      var MIDDLE_BUTTON = 1;

      if (element.is('a')) {
        addWatchThatUpdatesHrefAttribute();
      } else {
        element.click(function (event) {
          if (event.button === LEFT_BUTTON) {
            navigateToUrl(getUrl(), shouldOpenNewWindow(event));
          }
        });

        element.mouseup(function (event) {
          if (event.button === MIDDLE_BUTTON) {
            navigateToUrl(getUrl(), shouldOpenNewWindow(event));
          }
        });
      }

      function navigateToUrl(_url) {
        var newWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var url = _url;

        if (newWindow) {
          url = $window.location.origin + '/' + url;
          $window.open(url, '_blank');
        } else {
          if (!Route.isHtml5ModeEnabled()) {
            url = url.replace(/^#/, '');
          }
          $timeout(function () {
            return $location.url(url);
          });
        }
      }

      function shouldOpenNewWindow(event) {
        return event.button === MIDDLE_BUTTON || event.button === LEFT_BUTTON && (event.ctrlKey || event.metaKey);
      }

      function getUrl() {
        var urlWriters = Route.getUrlWriters();
        var locals = {};

        for (var writerName in urlWriters) {
          locals[writerName + 'UrlWriter'] = urlWriters[writerName];
        }

        var url = scope.$eval(attrs.routeOnClick, _.assign(locals, scope));

        return html5TheUrl(url);
      }

      function html5TheUrl(url) {
        var isAbsoluteUrl = /^(https?:){0,1}\/\/.+/.test(url);
        return Route.isHtml5ModeEnabled() || isAbsoluteUrl ? url : '#' + url;
      }

      function addWatchThatUpdatesHrefAttribute() {
        scope.$watch(function () {
          return '' + getUrl();
        }, function (newUrl) {
          element.attr('href', newUrl);
        });
      }
    }
  };
}

angular.module('bicker_router').directive('routeOnClick', routeOnClickFactory);

// @TODO none of the animation code in this directive has been tested. Not sure if it can be at this stage This needs further investigation.
// @TODO this code does too much, it should be refactored.

function routeViewFactory($log, $compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, PermissionDeniedError, $templateRequest, Route) {
  'ngInject';

  return {
    restrict: 'E',
    scope: false,
    replace: true,
    template: '<div></div>',
    controller: function controller() {},
    link: function link(viewDirectiveScope, iElement, iAttrs, ctrl) {
      var viewCreated = false;
      var viewScope = undefined;
      var viewController = {}; // NB will only be defined for components
      var viewManagementPending = false;
      var view = ViewBindings.getView(iAttrs.name);
      var bindings = view.getBindings();

      ctrl.viewName = iAttrs.name;

      iElement.addClass('ng-hide');

      var previousBoundState = undefined;
      var previousBinding = undefined;

      var getStateDataForBinding = function getStateDataForBinding(binding) {
        return _.cloneDeep(State.getSubset(getStateFieldsFromBinding(binding)));
      };

      function getComponentFromBinding(binding, field) {
        if (!field) {
          field = 'component';
        }
        var source = binding[field] ? $injector.get(binding[field] + 'Directive')[0] : binding;
        return _.defaults(_.pick(source, ['controller', 'templateUrl', 'controllerAs']), { controllerAs: '$ctrl' });
      }

      function hasRequiredData(binding) {
        var requiredState = binding.requiredState || [];

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = Array.from(requiredState)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var requirement = _step5.value;

            var negateResult = false;
            if ('!' === requirement.charAt(0)) {
              requirement = requirement.slice(1);
              negateResult = true;
            }

            var element = State.get(requirement);

            // Return false if element is undefined
            if (element === null) {
              return false;
            }

            // Only check value of element if it is defined
            if (negateResult) {
              element = !element;
            }
            if (!element) {
              return false;
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        if (binding.canActivate) {
          if (!$injector.invoke(binding.canActivate)) {
            return false;
          }
        }

        return true;
      }

      function manageView(element, bindings) {
        var matchingBinding = getMatchingBinding(bindings);

        if (!matchingBinding) {
          if (viewCreated) {
            $animate.addClass(element, 'ng-hide').then(function () {
              return destroyView(element);
            });
            previousBoundState = undefined;
            previousBinding = undefined;
            Route.deleteCurrentBinding(view.name);
          }
          return;
        }

        var newState = getStateDataForBinding(matchingBinding);
        if (matchingBinding === previousBinding && angular.equals(previousBoundState, newState)) {
          return;
        }

        var bindingChangedEventData = { viewName: iAttrs.name, currentBinding: matchingBinding };
        $rootScope.$broadcast('bicker_router.bindingChanged', bindingChangedEventData);

        previousBinding = matchingBinding;
        previousBoundState = newState;

        PendingViewCounter.increase();

        return showResolvingTemplate(element, matchingBinding).then(function (hasResolvingTemplate) {
          // @TODO: Magic number
          var delayForRealTemplateInsertion = hasResolvingTemplate ? 300 : undefined;

          if (!viewCreated) {
            return $animate.removeClass(element, 'ng-hide').then(function () {
              return createView(element, matchingBinding, delayForRealTemplateInsertion);
            });
          } else {
            viewScope.$destroy();
            if (viewController.$onDestroy) {
              viewController.$onDestroy();
            }
            return createView(element, matchingBinding, delayForRealTemplateInsertion);
          }
        });
      }

      function getMatchingBinding(bindings) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = Array.from(bindings)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var binding = _step6.value;

            if (hasRequiredData(binding)) {
              return binding;
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        return undefined;
      }

      function destroyView(element) {
        if (viewCreated === false) {
          return;
        }
        viewCreated = false;
        element.children().eq(0).remove();
        viewScope.$destroy();
        if (viewController.$onDestroy) {
          viewController.$onDestroy();
        }
      }

      function createView(element, binding, minimumDelay) {
        var timeStartedMainView = Date.now();
        var component = getComponentFromBinding(binding);

        var resolveIsPermitted = function resolveIsPermitted(binding) {
          if (binding.isPermitted) {
            return $injector.invoke(binding.isPermitted) ? $q.resolve(true) : $q.reject(PermissionDeniedError);
          }

          return $q.resolve(true);
        };

        var onSuccessfulResolution = function onSuccessfulResolution(args) {
          if (getMatchingBinding(bindings) !== binding) {
            return;
          }

          viewCreated = true;

          var resolvingTemplateShownTime = Date.now() - timeStartedMainView;

          var injectMainTemplate = function injectMainTemplate() {
            try {
              return renderComponent(element, component, args);
            } catch (e) {
              return showError(e, element, binding);
            } finally {
              // Wrapped in a timeout so that we can give the view time to properly initialise
              // before potentially triggering the intialViewsLoaded event
              $timeout(function () {
                if (!binding.manualCompletion) {
                  return PendingViewCounter.decrease();
                }
              });
            }
          };

          var mainTemplateInjectionDelay = Math.max(0, minimumDelay - resolvingTemplateShownTime);

          if (resolvingTemplateShownTime < minimumDelay) {
            return $timeout(function () {
              return injectMainTemplate();
            }, mainTemplateInjectionDelay);
          } else {
            return injectMainTemplate();
          }
        };

        var onResolutionFailure = function onResolutionFailure(error) {
          $timeout(function () {
            if (!binding.manualCompletion) {
              return PendingViewCounter.decrease();
            }
          });
          $log.error(error);
          return showResolvingError(error, element, binding);
        };

        Route.setCurrentBinding(view.name, binding);
        var promises = {
          template: $templateRequest(component.templateUrl),
          dependencies: resolve(binding),
          isPermitted: resolveIsPermitted(binding)
        };
        return $q.all(promises).then(onSuccessfulResolution, onResolutionFailure);
      }

      function showResolvingTemplate(element, binding) {
        if (!binding.resolvingTemplateUrl || !binding.resolve || Object.keys(binding.resolve).length === 0) {
          var deferred = $q.defer();
          deferred.resolve(false);
          return deferred.promise;
        }

        return $templateRequest(binding.resolvingTemplateUrl).then(function (template) {
          element.html(template);
          return $compile(element.contents())($rootScope.$new());
        });
      }

      function showResolvingError(error, element, binding) {
        if (error === PermissionDeniedError && binding.permissionDeniedTemplateUrl) {
          return showBasicTemplate(element, binding, 'permissionDeniedTemplateUrl');
        } else if (error === PermissionDeniedError && binding.permissionDeniedComponent) {
          return showErrorComponent(error, element, binding, 'permissionDeniedComponent');
        } else if (binding.resolvingErrorTemplateUrl) {
          return showBasicTemplate(element, binding, 'resolvingErrorTemplateUrl');
        } else if (binding.resolvingErrorComponent) {
          return showErrorComponent(error, element, binding, 'resolvingErrorComponent');
        }
      }

      function showError(error, element, binding) {
        var returnValue = null;
        if (binding.errorTemplateUrl) {
          returnValue = showErrorTemplate(element, binding);
        } else if (binding.errorComponent) {
          returnValue = showErrorComponent(error, element, binding);
        }

        $timeout(function () {
          if (!binding.manualCompletion) {
            return PendingViewCounter.decrease();
          }
        });
        return returnValue;
      }

      var showErrorTemplate = function showErrorTemplate(element, binding) {
        return showBasicTemplate(element, binding, 'errorTemplateUrl');
      };

      function showBasicTemplate(element, binding, templateField) {
        if (!binding[templateField]) {
          return;
        }
        return $templateRequest(binding[templateField]).then(function (template) {
          element.html(template);
          var link = $compile(element.contents());
          viewScope = viewDirectiveScope.$new();
          viewController = {};
          return link(viewScope);
        });
      }

      function showErrorComponent(error, element, binding, bindingComponentField) {
        if (!bindingComponentField) {
          bindingComponentField = 'errorComponent';
        }
        if (!binding[bindingComponentField]) {
          return;
        }
        var component = getComponentFromBinding(binding, bindingComponentField);
        var args = { dependencies: { error: error } };

        return $templateRequest(component.templateUrl).then(function (template) {
          args.template = template;
          return renderComponent(element, component, args);
        });
      }

      function renderComponent(element, component, args) {
        var dependencies = args.dependencies;
        var template = args.template;

        element.html(template);
        var link = $compile(element.contents());
        viewScope = viewDirectiveScope.$new();
        viewController = {};

        if (component.controller) {
          var locals = _.merge(dependencies, { $scope: viewScope, $element: element.children().eq(0) });

          try {
            viewController = $controller(component.controller, locals);
            locals.$scope[component.controllerAs] = viewController;
            if (viewController.$onInit) {
              viewController.$onInit();
            }
          } catch (error) {
            var errorMessage = void 0;

            try {
              if (_.isObject(error)) {
                errorMessage = JSON.stringify(error);
              } else {
                errorMessage = error;
              }
            } catch (jsonError) {
              errorMessage = 'Failed to serialize error object for logging';
            }

            $log.error('Failed instantiating controller for view ' + view + ': ' + errorMessage);
            throw error;
          }
        }

        return link(viewScope);
      }

      var resolve = function resolve(binding) {
        if (!binding.resolve || Object.keys(binding.resolve).length === 0) {
          var deferred = $q.defer();
          deferred.resolve({});
          return deferred.promise;
        }

        var promises = {};

        for (var dependencyName in binding.resolve) {
          var dependencyFactory = binding.resolve[dependencyName];
          try {
            promises[dependencyName] = $injector.invoke(dependencyFactory);
          } catch (e) {
            promises[dependencyName] = $q.reject(e);
          }
        }

        return $q.all(promises);
      };

      var getStateFieldsFromBinding = function getStateFieldsFromBinding(binding) {
        return _.union(binding.requiredState || [], binding.watchedState || []);
      };

      function stripNegationPrefix(str) {
        if (str.charAt(0) === '!') {
          return str.substr(1);
        } else {
          return str;
        }
      }

      var getStateFieldsFromView = function getStateFieldsFromView(view) {
        return _.flatten(_.map(view.getBindings(), getStateFieldsFromBinding));
      };

      var getFieldsToWatch = function getFieldsToWatch(view) {
        return _.uniq(_.map(getStateFieldsFromView(view), stripNegationPrefix));
      };

      var fields = getFieldsToWatch(view);

      return Route.whenReady().then(function () {
        viewManagementPending = true;

        // Try to start the ball rolling in case there's no dependencies and we can create the view immediately
        manageView(iElement, bindings);
        viewManagementPending = false;

        // Don't bother putting in a watcher if there's no dependencies that will ever trigger a change event
        if (fields.length === 0) {
          return;
        }

        var stateWatcher = function stateWatcher(changedPath, newValue, oldValue) {
          if (viewManagementPending) {
            return;
          }
          viewManagementPending = true;

          // Wrapped in a timeout so that we can finish the digest cycle before building the view, which should
          // prevent us from re-rendering a view multiple times if multiple properties of the same state dependency
          // get changed with repeated State.set calls
          return $timeout(function () {
            manageView(iElement, bindings);
            return viewManagementPending = false;
          });
        };

        State.watch(fields, stateWatcher);

        viewDirectiveScope.$on('$destroy', function () {
          return State.removeWatcher(stateWatcher);
        });
      });
    }
  };
}

angular.module('bicker_router').directive('view', routeViewFactory);

var PendingViewCounter = function () {
  function PendingViewCounter($rootScope) {
    _classCallCheck(this, PendingViewCounter);

    this.$rootScope = $rootScope;
    this.count = 0;
    this.initialViewsLoaded = false;
  }

  _createClass(PendingViewCounter, [{
    key: 'get',
    value: function get() {
      return this.count;
    }
  }, {
    key: 'increase',
    value: function increase() {
      return this.count += 1;
    }
  }, {
    key: 'decrease',
    value: function decrease() {
      this.count = Math.max(0, this.count - 1);
      if (this.count === 0) {
        if (!this.initialViewsLoaded) {
          this.initialViewsLoaded = true;
          this.$rootScope.$broadcast('bicker_router.initialViewsLoaded');
        } else {
          this.$rootScope.$broadcast('bicker_router.currentViewsLoaded');
        }
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.count = 0;
      return this.initialViewsLoaded = false;
    }
  }]);

  return PendingViewCounter;
}();

angular.module('bicker_router').factory('PendingViewCounter', ["$rootScope", function ($rootScope) {
  'ngInject';

  return new PendingViewCounter($rootScope);
}]);

var WatchableList = function () {
  function WatchableList(ObjectHelper, WatcherFactory, list) {
    _classCallCheck(this, WatchableList);

    this.ObjectHelper = ObjectHelper;
    this.WatcherFactory = WatcherFactory;

    this.list = list;
    this.watchers = [];
  }

  _createClass(WatchableList, [{
    key: 'get',
    value: function get(path) {
      return this.ObjectHelper.get(this.list, path);
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.list;
    }
  }, {
    key: 'getSubset',
    value: function getSubset(paths) {
      return _.zipObject(paths, _.map(paths, this.get.bind(this)));
    }
  }, {
    key: 'set',
    value: function set(path, value) {
      this.ObjectHelper.set(this.list, path, value);
      this._notifyWatchers(path, value);
    }
  }, {
    key: 'unset',
    value: function unset(paths) {
      var _this = this;

      if (!(paths instanceof Array)) {
        paths = [paths];
      }

      _(paths).each(function (path) {
        _this.ObjectHelper.unset(_this.list, path);
        _this._notifyWatchers(path, undefined);
      });
    }
  }, {
    key: 'watch',
    value: function watch(paths, handler) {
      var _this2 = this;

      if (!(paths instanceof Array)) {
        paths = [paths];
      }

      _(paths).each(function (path) {
        _this2.watchers.push(_this2.WatcherFactory.create(path, handler, _this2.get(path)));
      });
    }
  }, {
    key: 'removeWatcher',
    value: function removeWatcher(watcher) {
      if (this.watchers.length === 0) {
        return;
      }
      var newWatchers = [];

      _.each(this.watchers, function (thisWatcher) {
        if (thisWatcher.handler !== watcher) {
          newWatchers.push(thisWatcher);
        }
      });

      return this.watchers = newWatchers;
    }
  }, {
    key: '_notifyWatchers',
    value: function _notifyWatchers(changedPath, newValue) {
      var _this3 = this;

      _.each(this.watchers, function (watcher) {
        if (watcher.shouldNotify(changedPath, newValue)) {
          var newValueAtWatchedPath = _this3.ObjectHelper.get(_this3.list, watcher.watchPath);
          watcher.notify(changedPath, newValueAtWatchedPath);
        }
      });
    }
  }]);

  return WatchableList;
}();

var WatchableListFactory = function () {
  function WatchableListFactory(ObjectHelper, WatcherFactory) {
    _classCallCheck(this, WatchableListFactory);

    this.ObjectHelper = ObjectHelper;
    this.WatcherFactory = WatcherFactory;
  }

  _createClass(WatchableListFactory, [{
    key: 'create',
    value: function create() {
      var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new WatchableList(this.ObjectHelper, this.WatcherFactory, list);
    }
  }]);

  return WatchableListFactory;
}();

angular.module('bicker_router').factory('WatchableListFactory', ["ObjectHelper", "WatcherFactory", function (ObjectHelper, WatcherFactory) {
  'ngInject';

  return new WatchableListFactory(ObjectHelper, WatcherFactory);
}]);

var Watcher = function () {
  function Watcher(watchPath, handler) {
    var initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    _classCallCheck(this, Watcher);

    this.watchPath = watchPath;
    this.handler = handler;
    this.currentValue = _.cloneDeep(initialValue);
  }

  _createClass(Watcher, [{
    key: '_tokenizePath',
    value: function _tokenizePath(path) {
      return path.split('.');
    }
  }, {
    key: 'shouldNotify',
    value: function shouldNotify(changedPath, newValue) {
      // NB short circuit logic in the simple case
      if (this.watchPath === changedPath) {
        return !angular.equals(this.currentValue, newValue);
      }

      var watch = {
        path: this.watchPath,
        tokens: this._tokenizePath(this.watchPath),
        value: this.currentValue
      };

      var change = {
        path: changedPath,
        tokens: this._tokenizePath(changedPath),
        value: newValue
      };

      var minimumLenth = Math.min(change.tokens.length, watch.tokens.length);
      for (var tokenIndex = 0; tokenIndex < minimumLenth; tokenIndex++) {
        if (watch.tokens[tokenIndex] !== change.tokens[tokenIndex]) {
          return false;
        }
      }

      // NB if we get here then all common tokens match

      var changePathIsDescendant = change.tokens.length > watch.tokens.length;

      if (changePathIsDescendant) {
        var relativePath = change.tokens.slice(watch.tokens.length).join('.');
        var currentValueAtChangedPath = _.get(watch.value, relativePath);
        return !angular.equals(currentValueAtChangedPath, change.value);
      } else {
        var _relativePath = watch.tokens.slice(change.tokens.length).join('.');
        var newValueAtWatchPath = _.get(change.value, _relativePath);
        return !angular.equals(watch.value, newValueAtWatchPath);
      }
    }
  }, {
    key: 'notify',
    value: function notify(changedPath, newValue) {
      this.handler(changedPath, newValue, this.currentValue);
      this.currentValue = _.cloneDeep(newValue);
    }
  }]);

  return Watcher;
}();

var WatcherFactory = function () {
  function WatcherFactory() {
    _classCallCheck(this, WatcherFactory);
  }

  _createClass(WatcherFactory, [{
    key: 'create',
    value: function create(watchPath, handler) {
      var initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      return new Watcher(watchPath, handler, initialValue);
    }
  }]);

  return WatcherFactory;
}();

angular.module('bicker_router').factory('WatcherFactory', function () {
  return new WatcherFactory();
});

angular.module('bicker_router').provider('Route', ["ObjectHelper", function (ObjectHelper) {
  "ngInject";

  var tokens = {};
  var urlWriters = [];
  var urls = [];
  var persistentStates = [];
  var ready = false;
  var types = {};
  var html5Mode = false;

  var provider = {
    registerType: function registerType(name, config) {
      types[name] = config;
      types[name].regex = new RegExp(types[name].regex.source, 'i');
      return _.extend({ and: this.registerType }, this);
    },
    registerUrlToken: function registerUrlToken(name, config) {
      tokens[name] = _.extend({ name: name }, config);
      return _.extend({ and: this.registerUrlToken }, this);
    },
    registerUrlWriter: function registerUrlWriter(name, fn) {
      urlWriters[name] = fn;
      return _.extend({ and: this.registerUrlWriter }, this);
    },
    registerUrl: function registerUrl(pattern) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var urlData = {
        compiledUrl: this._compileUrlPattern(pattern, config),
        pattern: pattern
      };

      urls.push(_.extend(urlData, config));
      return _.extend({ and: this.registerUrl }, this);
    },
    setPersistentStates: function setPersistentStates() {
      for (var _len2 = arguments.length, stateList = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        stateList[_key3] = arguments[_key3];
      }

      _.forEach(stateList, function (state) {
        if (!_.includes(persistentStates, state)) {
          persistentStates.push(state);
        }
      });
    },
    setHtml5Mode: function setHtml5Mode(mode) {
      html5Mode = mode;
    },
    _compileUrlPattern: function _compileUrlPattern(urlPattern, config) {
      var match = void 0;
      urlPattern = this._escapeRegexSpecialCharacters(urlPattern);
      urlPattern = this._ensureOptionalTrailingSlash(urlPattern);

      var tokenRegex = /\{([A-Za-z\._0-9]+)\}/g;
      var urlRegex = urlPattern;

      if (!config.partialMatch) {
        urlRegex = '^' + urlRegex + '$';
      }

      var tokenList = [];

      while ((match = tokenRegex.exec(urlPattern)) !== null) {
        var token = tokens[match[1]];
        tokenList.push(token);
        urlRegex = urlRegex.replace(match[0], '(' + types[token.type].regex.source + ')');
      }

      urlRegex.replace('.', '\\.');

      return {
        regex: new RegExp(urlRegex, 'i'),
        tokens: tokenList
      };
    },
    _ensureOptionalTrailingSlash: function _ensureOptionalTrailingSlash(str) {
      if (str.match(/\/$/)) {
        return str.replace(/\/$/, '/?');
      }
      return str + '/?';
    },
    _escapeRegexSpecialCharacters: function _escapeRegexSpecialCharacters(str) {
      return str.replace(/[\-\[\]\/\(\)\*\+\?\\\^\$\|]/g, "\\$&");
    },
    $get: ["$location", "$injector", "$q", "$window", function $get($location, $injector, $q, $window) {
      'ngInject';

      // When getting a new instance of the service (only done once), we need to iterate over the urlWriters and turn
      // them into methods that invoke the REAL urlWriter, but providing dependency injection to it, while also
      // giving it the data that the callee passes in.

      // The reason we have to do this here is because we don't have access to the $injector back in the routeProvider.

      _.forIn(urlWriters, function (writer, writerName) {
        return urlWriters[writerName] = function (data) {
          if (!data) {
            data = {};
          }
          var locals = { UrlData: data };
          return $injector.invoke(writer, {}, locals);
        };
      });

      var flashStates = [];

      var service = {
        currentBindings: {},
        readyDeferred: $q.defer(),

        match: function match(urlToMatch) {
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = Array.from(urls)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var url = _step7.value;

              var match = void 0;
              if ((match = url.compiledUrl.regex.exec(urlToMatch)) !== null) {
                return { url: url, regexMatch: match };
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }

          return null;
        },
        extractData: function extractData(match) {
          var searchData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

          var defaults = this.extractDefaultData(match);
          var path = this.extractPathData(match);
          searchData = this.extractSearchData(searchData);
          return ObjectHelper.default(searchData, path, defaults);
        },
        extractSearchData: function extractSearchData(searchData) {
          if (!searchData) {
            searchData = $location.search();
          }
          var data = _.clone(searchData);
          var newData = {};

          _.forEach(data, function (value, key) {
            var targetKey = _.findKey(tokens, { searchAlias: key });
            if (!targetKey) {
              targetKey = key;
            }

            var tokenTypeName = tokens[targetKey] ? _.get(tokens[targetKey], 'type') : undefined;
            if (!tokens[targetKey] || types[tokenTypeName].regex.test(value)) {

              var tokenType = tokens[targetKey] ? tokens[targetKey].type : undefined;
              var typeTokenType = tokenType ? types[tokenType] : undefined;
              var tokenTypeParsed = typeTokenType ? typeTokenType.parser : undefined;

              if (tokenTypeParsed) {
                value = $injector.invoke(tokenTypeParsed, null, { token: value });
              }

              var tokenTargetKeyStatePath = tokens[targetKey] ? tokens[targetKey].statePath : undefined;
              var dataKey = tokenTargetKeyStatePath || targetKey;

              ObjectHelper.set(newData, dataKey, value);
            }
          });

          return newData;
        },
        extractDefaultData: function extractDefaultData(match) {
          var data = {};

          _.forEach(match.url.state, function (value, key) {
            ObjectHelper.set(data, key, (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? _.cloneDeep(value) : value);
          });

          return data;
        },
        extractPathData: function extractPathData(match) {
          var data = {};
          var pathTokens = match.url.compiledUrl.tokens;

          if (pathTokens.length === 0) {
            return {};
          }

          for (var n = 0, end = pathTokens.length - 1, asc = 0 <= end; asc ? n <= end : n >= end; asc ? n++ : n--) {
            var token = match.url.compiledUrl.tokens[n];
            var value = match.regexMatch[n + 1];

            if (types[token.type].parser) {
              value = $injector.invoke(types[token.type].parser, null, { token: value });
            }

            ObjectHelper.set(data, token.statePath || token.name, value);
          }

          return data;
        },
        getUrlWriters: function getUrlWriters() {
          return urlWriters;
        },
        getUrlWriter: function getUrlWriter(name) {
          return urlWriters[name];
        },
        invokeUrlWriter: function invokeUrlWriter(name) {
          var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          return urlWriters[name](data);
        },
        go: function go(name) {
          var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          var url = this.invokeUrlWriter(name, data);
          var isAbsoluteUrl = /^(https?:){0,1}\/\/.+/.test(url);
          return isAbsoluteUrl ? $window.location.href = url : $location.url(url);
        },
        getPersistentStates: function getPersistentStates() {
          return persistentStates;
        },
        resetFlashStates: function resetFlashStates() {
          flashStates = [];
        },
        addFlashStates: function addFlashStates() {
          for (var _len3 = arguments.length, newStates = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
            newStates[_key4] = arguments[_key4];
          }

          flashStates = flashStates.concat(newStates);
        },
        getFlashStates: function getFlashStates() {
          return flashStates;
        },
        setCurrentBinding: function setCurrentBinding(viewName, binding) {
          this.currentBindings[viewName] = binding;
        },
        getCurrentBinding: function getCurrentBinding(viewName) {
          return this.currentBindings[viewName];
        },
        deleteCurrentBinding: function deleteCurrentBinding(viewName) {
          delete this.currentBindings[viewName];
        },
        matchesCurrentBindingName: function matchesCurrentBindingName(viewName, bindingNameExpression) {
          var currentBinding = this.getCurrentBinding(viewName);

          if (!currentBinding) {
            return false;
          }

          return bindingNameExpression instanceof RegExp ? bindingNameExpression.test(currentBinding.name) : currentBinding.name === bindingNameExpression;
        },
        setReady: function setReady(ready) {
          if (!ready) {
            this.readyDeferred = $q.defer();
          } else {
            this.readyDeferred.resolve();
          }
          return ready;
        },
        isReady: function isReady() {
          return ready;
        },
        isHtml5ModeEnabled: function isHtml5ModeEnabled() {
          return html5Mode;
        },
        whenReady: function whenReady() {
          return this.readyDeferred.promise;
        }
      };

      return service;
    }]
  };

  provider.registerType('numeric', { regex: /\d+/, parser: ['token', function (token) {
      return parseInt(token);
    }] });
  provider.registerType('alpha', { regex: /[a-zA-Z]+/ });
  provider.registerType('any', { regex: /.+/ });
  provider.registerType('list', { regex: /.+/, parser: ['token', function (token) {
      return token.split(',');
    }] });

  return provider;
}]);

var StateProvider = function () {
  function StateProvider() {
    _classCallCheck(this, StateProvider);
  }

  _createClass(StateProvider, [{
    key: '$get',
    value: ["WatchableListFactory", function $get(WatchableListFactory) {
      'ngInject';

      return WatchableListFactory.create();
    }]
  }]);

  return StateProvider;
}();

angular.module('bicker_router').provider('State', new StateProvider());

angular.module('bicker_router').provider('ViewBindings', function () {
  var views = [];

  var View = function () {
    function View(name, bindings) {
      _classCallCheck(this, View);

      this.name = name;
      this.bindings = bindings;
      if (!(this.bindings instanceof Array)) {
        this.bindings = [this.bindings];
      }
    }

    _createClass(View, [{
      key: 'getBindings',
      value: function getBindings() {
        return this.bindings;
      }
    }]);

    return View;
  }();

  return {
    bind: function bind(name, config) {

      function applyCommonRequiredState(bindings, commonRequiredState) {
        var result = [];
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = Array.from(newBindings)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var binding = _step8.value;

            if (!(binding.requiredState instanceof Array)) {
              binding.requiredState = [binding.requiredState];
            }
            result.push(binding.requiredState = binding.requiredState.concat(commonRequiredState));
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        return result;
      }

      function applyCommonResolve(bindings, commonResolve) {
        var result = [];
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = Array.from(newBindings)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var binding = _step9.value;

            if (!('resolve' in binding)) {
              binding.resolve = {};
            }
            result.push(_.defaults(binding.resolve, commonResolve));
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }

        return result;
      }

      function applyCommonFields(newBindings) {
        var basicCommonFields = [{ name: 'commonPermissionDeniedTemplateUrl', overrideField: 'permissionDeniedTemplateUrl' }, { name: 'commonPermissionDeniedComponent', overrideField: 'permissionDeniedComponent' }, { name: 'commonResolvingTemplateUrl', overrideField: 'resolvingTemplateUrl' }, { name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl' }, { name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent' }, { name: 'commonErrorComponent', overrideField: 'errorComponent' }, { name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl' }];

        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
          for (var _iterator10 = Array.from(basicCommonFields)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var commonField = _step10.value;

            if (commonField.name in config) {
              defaultBindingField(newBindings, commonField.overrideField, config[commonField.name]);
            }
          }
        } catch (err) {
          _didIteratorError10 = true;
          _iteratorError10 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion10 && _iterator10.return) {
              _iterator10.return();
            }
          } finally {
            if (_didIteratorError10) {
              throw _iteratorError10;
            }
          }
        }

        if ('commonRequiredState' in config) {
          applyCommonRequiredState(newBindings, config['commonRequiredState']);
        }

        if ('commonResolve' in config) {
          return applyCommonResolve(newBindings, config['commonResolve']);
        }
      }

      function defaultBindingField(bindings, fieldName, defaultValue) {
        var result = [];
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = Array.from(newBindings)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var binding = _step11.value;

            var item = void 0;
            if (!(fieldName in binding)) {
              item = binding[fieldName] = defaultValue;
            }
            result.push(item);
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        return result;
      }

      var newBindings = [];
      if ('bindings' in config) {
        newBindings = config['bindings'];
      } else {
        newBindings = config instanceof Array ? config : [config];
      }

      if (!(newBindings.length > 0)) {
        throw new Error('Invalid call to ViewBindingsProvider.bind for name \'' + name + '\'');
      }

      applyCommonFields(newBindings);
      return views[name] = new View(name, newBindings);
    },
    $get: function $get() {
      return {
        getView: function getView(view) {
          return views[view];
        }
      };
    }
  };
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxRQUFBLE1BQUEsQ0FBQSxlQUFBLEVBQWdDLENBQWhDLFdBQWdDLENBQWhDLEVBQUEsR0FBQSxxRkFBbUQsVUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsWUFBQSxFQUFBLGtCQUFBLEVBQWlGO0FBQ2xJOztBQUVBLE1BQUksU0FBSixTQUFBO0FBQ0EsYUFBQSxHQUFBLENBQUEsc0JBQUEsRUFBdUMsWUFBWTtBQUNqRCxRQUFJLE1BQUosT0FBSSxFQUFKLEVBQXFCO0FBQ25CLFlBQUEsUUFBQSxDQUFBLEtBQUE7QUFDRDtBQUhILEdBQUE7O0FBTUEsYUFBQSxHQUFBLENBQUEsd0JBQUEsRUFBeUMsVUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFxQjtBQUM1RDtBQUNBLFFBQUksT0FBQSxLQUFKLENBQUE7QUFDQSxRQUFJLFdBQUosTUFBQSxFQUF1QjtBQUNyQjtBQUNEOztBQUVELGFBQUEsTUFBQTs7QUFFQSx1QkFBQSxLQUFBO0FBQ0EsUUFBTSxRQUFRLE1BQUEsS0FBQSxDQUFZLFVBQTFCLElBQTBCLEVBQVosQ0FBZDs7QUFFQSxRQUFJLENBQUosS0FBQSxFQUFZO0FBQ1YsYUFBQSxFQUFBO0FBREYsS0FBQSxNQUVPO0FBQ0wsYUFBTyxNQUFBLFdBQUEsQ0FBUCxLQUFPLENBQVA7QUFDRDs7QUFFRCxRQUFJLGdCQUFnQixhQUFBLEtBQUEsQ0FBbUIsTUFBbkIsSUFBQSxFQUFwQixJQUFvQixDQUFwQjtBQUNBLG9CQUFnQixFQUFBLFVBQUEsQ0FBQSxhQUFBLEVBQTRCLE1BQUEsbUJBQUEsR0FBQSxNQUFBLENBQW1DLE1BQS9FLGNBQStFLEVBQW5DLENBQTVCLENBQWhCOztBQUVBLFFBQU0sWUFB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QUFBLEdBQU4sQ0FBSSxDQUFKLEVBQStCO0FBQzdCLGNBQU0sSUFBQSxLQUFBLENBQUEsMERBQUEsSUFBQSxHQUFOLElBQU0sQ0FBTjtBQUNEOztBQUVELHdCQUFBLFdBQUE7QUFDQSxhQUFPLE1BQUEsSUFBQSxJQUFjLElBQUEsSUFBQSxDQUFBLElBQUEsRUFBckIsV0FBcUIsQ0FBckI7QUE1RUcsS0FBQTtBQUFBLFVBQUEsU0FBQSxJQUFBLEdBK0VFO0FBQ0wsYUFBTztBQUFBLGlCQUFBLFNBQUEsT0FBQSxDQUFBLElBQUEsRUFDUztBQUNaLGlCQUFPLE1BQVAsSUFBTyxDQUFQO0FBQ0Q7QUFISSxPQUFQO0FBS0Q7QUFyRkksR0FBUDtBQWpCRixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInLCBbJ25nQW5pbWF0ZSddKS5ydW4oZnVuY3Rpb24gKFN0YXRlLCBSb3V0ZSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCBPYmplY3RIZWxwZXIsIFBlbmRpbmdWaWV3Q291bnRlcikge1xuICBcIm5nSW5qZWN0XCI7XG5cbiAgbGV0IG9sZFVybCA9IHVuZGVmaW5lZDtcbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChSb3V0ZS5pc1JlYWR5KCkpIHtcbiAgICAgIFJvdXRlLnNldFJlYWR5KGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKGUsIG5ld1VybCkge1xuICAgIC8vIFdvcmstYXJvdW5kIGZvciBBbmd1bGFySlMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9pc3N1ZXMvODM2OFxuICAgIGxldCBkYXRhO1xuICAgIGlmIChuZXdVcmwgPT09IG9sZFVybCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9sZFVybCA9IG5ld1VybDtcblxuICAgIFBlbmRpbmdWaWV3Q291bnRlci5yZXNldCgpO1xuICAgIGNvbnN0IG1hdGNoID0gUm91dGUubWF0Y2goJGxvY2F0aW9uLnBhdGgoKSk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBSb3V0ZS5leHRyYWN0RGF0YShtYXRjaCk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkc1RvVW5zZXQgPSBPYmplY3RIZWxwZXIubm90SW4oU3RhdGUubGlzdCwgZGF0YSk7XG4gICAgZmllbGRzVG9VbnNldCA9IF8uZGlmZmVyZW5jZShmaWVsZHNUb1Vuc2V0LCBSb3V0ZS5nZXRQZXJzaXN0ZW50U3RhdGVzKCkuY29uY2F0KFJvdXRlLmdldEZsYXNoU3RhdGVzKCkpKTtcblxuICAgIGNvbnN0IGV2ZW50RGF0YSA9IHt1bnNldHRpbmc6IGZpZWxkc1RvVW5zZXQsIHNldHRpbmc6IGRhdGF9O1xuICAgICRyb290U2NvcGUuJGVtaXQoJ2JpY2tlcl9yb3V0ZXIuYmVmb3JlU3RhdGVDaGFuZ2UnLCBldmVudERhdGEpO1xuXG4gICAgaWYgKChldmVudERhdGEudW5zZXR0aW5nKS5sZW5ndGggIT09IDApIHtcbiAgICAgIFN0YXRlLnVuc2V0KGV2ZW50RGF0YS51bnNldHRpbmcpO1xuICAgIH1cblxuICAgIF8uZm9yRWFjaChldmVudERhdGEuc2V0dGluZywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIFJvdXRlLnJlc2V0Rmxhc2hTdGF0ZXMoKTtcbiAgICBSb3V0ZS5zZXRSZWFkeSh0cnVlKTtcbiAgfSk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5jb25zdGFudCgnT2JqZWN0SGVscGVyJywge1xuICBnZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XTtcbiAgfSxcblxuICBzZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIGlmIChwYXJlbnRbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJlbnRbc2VnbWVudF0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XSA9IHZhbHVlO1xuICB9LFxuXG4gIHVuc2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cblxuICAgIGlmIChwYXJlbnRba2V5XSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGRlbGV0ZSBwYXJlbnRba2V5XTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICAvLyBSZWN1cnNpdmVseSByZXR1cm4gdGhlIHByb3BlcnRpZXMgaW4gYSB0aGF0IGFyZW4ndCBpbiBiXG4gIG5vdEluKGEsIGIsIHByZWZpeCA9ICcnKSB7XG4gICAgbGV0IG5vdEluID0gW107XG4gICAgcHJlZml4ID0gcHJlZml4Lmxlbmd0aCA+IDAgPyBgJHtwcmVmaXh9LmAgOiAnJztcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIEFycmF5LmZyb20oT2JqZWN0LmtleXMoYSkpKSB7XG4gICAgICBjb25zdCB0aGlzUGF0aCA9IGAke3ByZWZpeH0ke2tleX1gO1xuXG4gICAgICBpZiAoYltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm90SW4ucHVzaCh0aGlzUGF0aCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBhW2tleV0gPT09ICdvYmplY3QnKSAmJiAoIShhW2tleV0gaW5zdGFuY2VvZiBBcnJheSkpKSB7XG4gICAgICAgIG5vdEluID0gbm90SW4uY29uY2F0KHRoaXMubm90SW4oYVtrZXldLCBiW2tleV0sIHRoaXNQYXRoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdEluO1xuICB9LFxuXG4gIGRlZmF1bHQob3ZlcnJpZGVzLCAuLi5kZWZhdWx0U2V0cykge1xuICAgIGxldCBkZWZhdWx0U2V0LCB2YWx1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgIGlmIChkZWZhdWx0U2V0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGRlZmF1bHRTZXQgPSBkZWZhdWx0U2V0c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFNldCA9IHRoaXMuZGVmYXVsdCguLi5BcnJheS5mcm9tKGRlZmF1bHRTZXRzIHx8IFtdKSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGVmYXVsdFNldCkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0U2V0W2tleV07XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIG92ZXJyaWRlc1trZXldID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMuZGVmYXVsdChvdmVycmlkZXNba2V5XSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvdmVycmlkZXMpIHtcbiAgICAgIHZhbHVlID0gb3ZlcnJpZGVzW2tleV07XG4gICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldIHx8IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuXG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ1Blcm1pc3Npb25EZW5pZWRFcnJvcicsIFN5bWJvbCgnUGVybWlzc2lvbkRlbmllZEVycm9yJykpO1xuXG4vLyBVc2FnZTpcbi8vXG4vLyBJZiB5b3Ugd2FudCB0byBhZGQgdGhlIGNsYXNzIFwiYWN0aXZlXCIgdG8gYW4gYW5jaG9yIGVsZW1lbnQgd2hlbiB0aGUgXCJtYWluXCIgdmlldyBoYXMgYSBiaW5kaW5nXG4vLyB3aXRoIHRoZSBuYW1lIFwibXlCaW5kaW5nXCIgcmVuZGVyZWQgd2l0aGluIGl0XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCJ7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAnbXlCaW5kaW5nJyB9XCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuLy8gWW91IGNhbiBhbHNvIHVzZSByZWd1bGFyIGV4cHJlc3Npb25zIGZvciB0aGUgYmluZGluZyBuYW1lLCBidXQgdG8gZG8gc28geW91IGhhdmUgdG8gcHJvdmlkZSBhIG1ldGhvZFxuLy8gb24geW91ciBjb250cm9sbGVyIHdoaWNoIHJldHVybnMgdGhlIHJvdXRlIGNsYXNzIGRlZmluaXRpb24gb2JqZWN0LCBiZWNhdXNlIEFuZ3VsYXJKUyBleHByZXNzaW9uc1xuLy8gZG9uJ3Qgc3VwcG9ydCBpbmxpbmUgcmVndWxhciBleHByZXNzaW9uc1xuLy9cbi8vIGNsYXNzIE15Q29udHJvbGxlciB7XG4vLyAgZ2V0Um91dGVDbGFzc09iamVjdCgpIHtcbi8vICAgIHJldHVybiB7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAvbXlCaW5kLyB9XG4vLyAgfVxuLy8gfVxuLy9cbi8vIDxhIHJvdXRlLWNsYXNzPVwiJGN0cmwuZ2V0Um91dGVDbGFzc09iamVjdCgpXCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuXG5mdW5jdGlvbiByb3V0ZUNsYXNzRmFjdG9yeShSb3V0ZSkge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIHNjb3BlLiR3YXRjaCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvdXRlQ2xhc3NEZWZpbml0aW9uID0gc2NvcGUuJGV2YWwoaUF0dHJzWydyb3V0ZUNsYXNzJ10pO1xuXG4gICAgICAgIGlmICghUm91dGUubWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZShyb3V0ZUNsYXNzRGVmaW5pdGlvbi52aWV3TmFtZSwgcm91dGVDbGFzc0RlZmluaXRpb24uYmluZGluZ05hbWUpKSB7XG4gICAgICAgICAgaWYgKGlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgaUVsZW1lbnQuYWRkQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVDbGFzcycsIHJvdXRlQ2xhc3NGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVIcmVmRmFjdG9yeSAoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0JztcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgc2NvcGU6IHRydWUsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGlmIChpQXR0cnMuaWdub3JlSHJlZiA9PT0gdW5kZWZpbmVkICYmIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgIGlFbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgY29uc3QgdXJsUGF0aCA9IGlFbGVtZW50LmF0dHIoJ2hyZWYnKS5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmxQYXRoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvYmplY3QgPSBSb3V0ZS5nZXRVcmxXcml0ZXJzKCk7XG4gICAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IHdyaXRlciA9IG9iamVjdFt3cml0ZXJOYW1lXTtcbiAgICAgICAgc2NvcGVbYCR7d3JpdGVyTmFtZX1VcmxXcml0ZXJgXSA9IHdyaXRlcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNjb3BlLiR3YXRjaChpQXR0cnMucm91dGVIcmVmLCAobmV3VXJsKSA9PiB7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmIChSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgIHVybCA9IG5ld1VybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmwgPSBgIyR7bmV3VXJsfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlFbGVtZW50LmF0dHIoJ2hyZWYnLCB1cmwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVIcmVmJywgcm91dGVIcmVmRmFjdG9yeSk7XG5cbmZ1bmN0aW9uIHJvdXRlT25DbGlja0ZhY3RvcnkgKFJvdXRlLCAkbG9jYXRpb24sICR3aW5kb3csICR0aW1lb3V0KSB7XG4gICduZ0luamVjdCc7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuXG4gICAgbGluayAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBjb25zdCBMRUZUX0JVVFRPTiA9IDA7XG4gICAgICBjb25zdCBNSURETEVfQlVUVE9OID0gMTtcblxuICAgICAgaWYgKGVsZW1lbnQuaXMoJ2EnKSkge1xuICAgICAgICBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT09IExFRlRfQlVUVE9OKSB7XG4gICAgICAgICAgICBuYXZpZ2F0ZVRvVXJsKGdldFVybCgpLCBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50Lm1vdXNldXAoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gTUlERExFX0JVVFRPTikge1xuICAgICAgICAgICAgbmF2aWdhdGVUb1VybChnZXRVcmwoKSwgc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG5hdmlnYXRlVG9VcmwoX3VybCwgbmV3V2luZG93ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHVybCA9IF91cmw7XG5cbiAgICAgICAgaWYgKG5ld1dpbmRvdykge1xuICAgICAgICAgIHVybCA9IGAkeyR3aW5kb3cubG9jYXRpb24ub3JpZ2lufS8ke3VybH1gO1xuICAgICAgICAgICR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIVJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXiMvLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgICR0aW1lb3V0KCgpID0+ICRsb2NhdGlvbi51cmwodXJsKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkge1xuICAgICAgICByZXR1cm4gZXZlbnQuYnV0dG9uID09PSBNSURETEVfQlVUVE9OIHx8IChldmVudC5idXR0b24gPT09IExFRlRfQlVUVE9OICYmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0VXJsKCkge1xuICAgICAgICBjb25zdCB1cmxXcml0ZXJzID0gUm91dGUuZ2V0VXJsV3JpdGVycygpO1xuICAgICAgICBjb25zdCBsb2NhbHMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gdXJsV3JpdGVycykge1xuICAgICAgICAgIGxvY2Fsc1tgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gdXJsV3JpdGVyc1t3cml0ZXJOYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHNjb3BlLiRldmFsKGF0dHJzLnJvdXRlT25DbGljaywgXy5hc3NpZ24obG9jYWxzLCBzY29wZSkpO1xuXG4gICAgICAgIHJldHVybiBodG1sNVRoZVVybCh1cmwpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBodG1sNVRoZVVybCh1cmwpIHtcbiAgICAgICAgY29uc3QgaXNBYnNvbHV0ZVVybCA9ICgvXihodHRwcz86KXswLDF9XFwvXFwvLisvKS50ZXN0KHVybCk7XG4gICAgICAgIHJldHVybiBSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSB8fCBpc0Fic29sdXRlVXJsID8gdXJsIDogYCMke3VybH1gO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Z2V0VXJsKCl9YDtcbiAgICAgICAgfSwgKG5ld1VybCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuYXR0cignaHJlZicsIG5ld1VybCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlT25DbGljaycsIHJvdXRlT25DbGlja0ZhY3RvcnkpO1xuXG4vLyBAVE9ETyBub25lIG9mIHRoZSBhbmltYXRpb24gY29kZSBpbiB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiB0ZXN0ZWQuIE5vdCBzdXJlIGlmIGl0IGNhbiBiZSBhdCB0aGlzIHN0YWdlIFRoaXMgbmVlZHMgZnVydGhlciBpbnZlc3RpZ2F0aW9uLlxuLy8gQFRPRE8gdGhpcyBjb2RlIGRvZXMgdG9vIG11Y2gsIGl0IHNob3VsZCBiZSByZWZhY3RvcmVkLlxuXG5mdW5jdGlvbiByb3V0ZVZpZXdGYWN0b3J5KCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsIFBlcm1pc3Npb25EZW5pZWRFcnJvciwgJHRlbXBsYXRlUmVxdWVzdCwgUm91dGUpIHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiBmYWxzZSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlOiAnPGRpdj48L2Rpdj4nLFxuICAgIGNvbnRyb2xsZXIgKCkge30sXG4gICAgbGluayAodmlld0RpcmVjdGl2ZVNjb3BlLCBpRWxlbWVudCwgaUF0dHJzLCBjdHJsKSB7XG4gICAgICBsZXQgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgIGxldCB2aWV3U2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgdmlld0NvbnRyb2xsZXIgPSB7fTsgLy8gTkIgd2lsbCBvbmx5IGJlIGRlZmluZWQgZm9yIGNvbXBvbmVudHNcbiAgICAgIGxldCB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHZpZXcgPSBWaWV3QmluZGluZ3MuZ2V0VmlldyhpQXR0cnMubmFtZSk7XG4gICAgICBjb25zdCBiaW5kaW5ncyA9IHZpZXcuZ2V0QmluZGluZ3MoKTtcblxuICAgICAgY3RybC52aWV3TmFtZSA9IGlBdHRycy5uYW1lXG5cbiAgICAgIGlFbGVtZW50LmFkZENsYXNzKCduZy1oaWRlJyk7XG5cbiAgICAgIGxldCBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nID0gYmluZGluZyA9PiBfLmNsb25lRGVlcChTdGF0ZS5nZXRTdWJzZXQoZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyhiaW5kaW5nKSkpO1xuXG4gICAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBmaWVsZCkge1xuICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgZmllbGQgPSAnY29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzb3VyY2UgPSBiaW5kaW5nW2ZpZWxkXSA/ICRpbmplY3Rvci5nZXQoYCR7YmluZGluZ1tmaWVsZF19RGlyZWN0aXZlYClbMF0gOiBiaW5kaW5nO1xuICAgICAgICByZXR1cm4gXy5kZWZhdWx0cyhfLnBpY2soc291cmNlLCBbJ2NvbnRyb2xsZXInLCAndGVtcGxhdGVVcmwnLCAnY29udHJvbGxlckFzJ10pLCB7Y29udHJvbGxlckFzOiAnJGN0cmwnfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW107XG5cbiAgICAgICAgZm9yIChsZXQgcmVxdWlyZW1lbnQgb2YgQXJyYXkuZnJvbShyZXF1aXJlZFN0YXRlKSkge1xuICAgICAgICAgIGxldCBuZWdhdGVSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoJyEnID09PSByZXF1aXJlbWVudC5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIHJlcXVpcmVtZW50ID0gcmVxdWlyZW1lbnQuc2xpY2UoMSk7XG4gICAgICAgICAgICBuZWdhdGVSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBlbGVtZW50ID0gU3RhdGUuZ2V0KHJlcXVpcmVtZW50KTtcblxuICAgICAgICAgIC8vIFJldHVybiBmYWxzZSBpZiBlbGVtZW50IGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGlmICgoZWxlbWVudCA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPbmx5IGNoZWNrIHZhbHVlIG9mIGVsZW1lbnQgaWYgaXQgaXMgZGVmaW5lZFxuICAgICAgICAgIGlmIChuZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSAhZWxlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpbmRpbmcuY2FuQWN0aXZhdGUpIHtcbiAgICAgICAgICBpZiAoISRpbmplY3Rvci5pbnZva2UoYmluZGluZy5jYW5BY3RpdmF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWFuYWdlVmlldyhlbGVtZW50LCBiaW5kaW5ncykge1xuICAgICAgICBjb25zdCBtYXRjaGluZ0JpbmRpbmcgPSBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpO1xuXG4gICAgICAgIGlmICghbWF0Y2hpbmdCaW5kaW5nKSB7XG4gICAgICAgICAgaWYgKHZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveVZpZXcoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIFJvdXRlLmRlbGV0ZUN1cnJlbnRCaW5kaW5nKHZpZXcubmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1N0YXRlID0gZ2V0U3RhdGVEYXRhRm9yQmluZGluZyhtYXRjaGluZ0JpbmRpbmcpO1xuICAgICAgICBpZiAoKG1hdGNoaW5nQmluZGluZyA9PT0gcHJldmlvdXNCaW5kaW5nKSAmJiBhbmd1bGFyLmVxdWFscyhwcmV2aW91c0JvdW5kU3RhdGUsIG5ld1N0YXRlKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJpbmRpbmdDaGFuZ2VkRXZlbnREYXRhID0geyB2aWV3TmFtZTogaUF0dHJzLm5hbWUsIGN1cnJlbnRCaW5kaW5nOiBtYXRjaGluZ0JpbmRpbmcgfTtcbiAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmJpbmRpbmdDaGFuZ2VkJywgYmluZGluZ0NoYW5nZWRFdmVudERhdGEpO1xuXG4gICAgICAgIHByZXZpb3VzQmluZGluZyA9IG1hdGNoaW5nQmluZGluZztcbiAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gbmV3U3RhdGU7XG5cbiAgICAgICAgUGVuZGluZ1ZpZXdDb3VudGVyLmluY3JlYXNlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKGhhc1Jlc29sdmluZ1RlbXBsYXRlKSB7XG4gICAgICAgICAgLy8gQFRPRE86IE1hZ2ljIG51bWJlclxuICAgICAgICAgIGNvbnN0IGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uID0gaGFzUmVzb2x2aW5nVGVtcGxhdGUgPyAzMDAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBpZiAoIXZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGFuaW1hdGUucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBpZiAodmlld0NvbnRyb2xsZXIuJG9uRGVzdHJveSkgeyB2aWV3Q29udHJvbGxlci4kb25EZXN0cm95KCk7IH1cbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykge1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShiaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZXN0cm95VmlldyhlbGVtZW50KSB7XG4gICAgICAgIGlmICh2aWV3Q3JlYXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgZWxlbWVudC5jaGlsZHJlbigpLmVxKDApLnJlbW92ZSgpO1xuICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgaWYgKHZpZXdDb250cm9sbGVyLiRvbkRlc3Ryb3kpIHsgdmlld0NvbnRyb2xsZXIuJG9uRGVzdHJveSgpOyB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXcoZWxlbWVudCwgYmluZGluZywgbWluaW11bURlbGF5KSB7XG4gICAgICAgIGNvbnN0IHRpbWVTdGFydGVkTWFpblZpZXcgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nKTtcblxuICAgICAgICBjb25zdCByZXNvbHZlSXNQZXJtaXR0ZWQgPSBmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICAgIGlmIChiaW5kaW5nLmlzUGVybWl0dGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmludm9rZShiaW5kaW5nLmlzUGVybWl0dGVkKVxuICAgICAgICAgICAgICA/ICRxLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgICAgICAgOiAkcS5yZWplY3QoUGVybWlzc2lvbkRlbmllZEVycm9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gJHEucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgICBpZiAoZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSAhPT0gYmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZpZXdDcmVhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGNvbnN0IHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lID0gRGF0ZS5ub3coKSAtIHRpbWVTdGFydGVkTWFpblZpZXc7XG5cbiAgICAgICAgICBjb25zdCBpbmplY3RNYWluVGVtcGxhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzaG93RXJyb3IoZSwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBnaXZlIHRoZSB2aWV3IHRpbWUgdG8gcHJvcGVybHkgaW5pdGlhbGlzZVxuICAgICAgICAgICAgICAvLyBiZWZvcmUgcG90ZW50aWFsbHkgdHJpZ2dlcmluZyB0aGUgaW50aWFsVmlld3NMb2FkZWQgZXZlbnRcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkgPSBNYXRoLm1heCgwLCBtaW5pbXVtRGVsYXkgLSByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSk7XG5cbiAgICAgICAgICBpZiAocmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiBpbmplY3RNYWluVGVtcGxhdGUoKSwgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0TWFpblRlbXBsYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUmVzb2x1dGlvbkZhaWx1cmUgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJGxvZy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgUm91dGUuc2V0Q3VycmVudEJpbmRpbmcodmlldy5uYW1lLCBiaW5kaW5nKTtcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7XG4gICAgICAgICAgdGVtcGxhdGU6ICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKSxcbiAgICAgICAgICBkZXBlbmRlbmNpZXM6IHJlc29sdmUoYmluZGluZyksXG4gICAgICAgICAgaXNQZXJtaXR0ZWQ6IHJlc29sdmVJc1Blcm1pdHRlZChiaW5kaW5nKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24sIG9uUmVzb2x1dGlvbkZhaWx1cmUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwgfHwgIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIHJldHVybiAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKCRyb290U2NvcGUuJG5ldygpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoZXJyb3IgPT09IFBlcm1pc3Npb25EZW5pZWRFcnJvciAmJiBiaW5kaW5nLnBlcm1pc3Npb25EZW5pZWRUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVybiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAncGVybWlzc2lvbkRlbmllZFRlbXBsYXRlVXJsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3IgPT09IFBlcm1pc3Npb25EZW5pZWRFcnJvciAmJiBiaW5kaW5nLnBlcm1pc3Npb25EZW5pZWRDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCAncGVybWlzc2lvbkRlbmllZENvbXBvbmVudCcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVybiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGJpbmRpbmcuZXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5lcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ2Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgdGVtcGxhdGVGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG4gICAgICAgICAgdmlld0NvbnRyb2xsZXIgPSB7fTtcbiAgICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgICBiaW5kaW5nQ29tcG9uZW50RmllbGQgPSAnZXJyb3JDb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYmluZGluZ1tiaW5kaW5nQ29tcG9uZW50RmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB7ZGVwZW5kZW5jaWVzOiB7ZXJyb3J9fTtcblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgYXJncy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpIHtcbiAgICAgICAgY29uc3Qge2RlcGVuZGVuY2llc30gPSBhcmdzO1xuICAgICAgICBjb25zdCB7dGVtcGxhdGV9ID0gYXJncztcblxuICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcbiAgICAgICAgdmlld0NvbnRyb2xsZXIgPSB7fTtcblxuICAgICAgICBpZiAoY29tcG9uZW50LmNvbnRyb2xsZXIpIHtcbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSBfLm1lcmdlKGRlcGVuZGVuY2llcywgeyRzY29wZTogdmlld1Njb3BlLCAkZWxlbWVudDogZWxlbWVudC5jaGlsZHJlbigpLmVxKDApfSk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmlld0NvbnRyb2xsZXIgPSAkY29udHJvbGxlcihjb21wb25lbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgICAgIGxvY2Fscy4kc2NvcGVbY29tcG9uZW50LmNvbnRyb2xsZXJBc10gPSB2aWV3Q29udHJvbGxlcjtcbiAgICAgICAgICAgIGlmICh2aWV3Q29udHJvbGxlci4kb25Jbml0KSB7IHZpZXdDb250cm9sbGVyLiRvbkluaXQoKTsgfVxuICAgICAgICAgIH0gICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9ICdGYWlsZWQgdG8gc2VyaWFsaXplIGVycm9yIG9iamVjdCBmb3IgbG9nZ2luZyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRsb2cuZXJyb3IoYEZhaWxlZCBpbnN0YW50aWF0aW5nIGNvbnRyb2xsZXIgZm9yIHZpZXcgJHt2aWV3fTogJHtlcnJvck1lc3NhZ2V9YCk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlID0gZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHt9KTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCBkZXBlbmRlbmN5TmFtZSBpbiBiaW5kaW5nLnJlc29sdmUpIHtcbiAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5RmFjdG9yeSA9IGJpbmRpbmcucmVzb2x2ZVtkZXBlbmRlbmN5TmFtZV07XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRpbmplY3Rvci5pbnZva2UoZGVwZW5kZW5jeUZhY3RvcnkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRxLnJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcgPSBiaW5kaW5nID0+IF8udW5pb24oYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdLCBiaW5kaW5nLndhdGNoZWRTdGF0ZSB8fCBbXSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0cmlwTmVnYXRpb25QcmVmaXgoc3RyKSB7XG4gICAgICAgIGlmIChzdHIuY2hhckF0KDApID09PSAnIScpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnN1YnN0cigxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbVZpZXcgPSB2aWV3ID0+IF8uZmxhdHRlbihfLm1hcCh2aWV3LmdldEJpbmRpbmdzKCksIGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcpKTtcblxuICAgICAgY29uc3QgZ2V0RmllbGRzVG9XYXRjaCA9IHZpZXcgPT4gXy51bmlxKF8ubWFwKGdldFN0YXRlRmllbGRzRnJvbVZpZXcodmlldyksIHN0cmlwTmVnYXRpb25QcmVmaXgpKTtcblxuICAgICAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzVG9XYXRjaCh2aWV3KTtcblxuICAgICAgcmV0dXJuIFJvdXRlLndoZW5SZWFkeSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRyeSB0byBzdGFydCB0aGUgYmFsbCByb2xsaW5nIGluIGNhc2UgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgYW5kIHdlIGNhbiBjcmVhdGUgdGhlIHZpZXcgaW1tZWRpYXRlbHlcbiAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBEb24ndCBib3RoZXIgcHV0dGluZyBpbiBhIHdhdGNoZXIgaWYgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgdGhhdCB3aWxsIGV2ZXIgdHJpZ2dlciBhIGNoYW5nZSBldmVudFxuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXRlV2F0Y2hlciA9IGZ1bmN0aW9uIChjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgaWYgKHZpZXdNYW5hZ2VtZW50UGVuZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZmluaXNoIHRoZSBkaWdlc3QgY3ljbGUgYmVmb3JlIGJ1aWxkaW5nIHRoZSB2aWV3LCB3aGljaCBzaG91bGRcbiAgICAgICAgICAvLyBwcmV2ZW50IHVzIGZyb20gcmUtcmVuZGVyaW5nIGEgdmlldyBtdWx0aXBsZSB0aW1lcyBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzIG9mIHRoZSBzYW1lIHN0YXRlIGRlcGVuZGVuY3lcbiAgICAgICAgICAvLyBnZXQgY2hhbmdlZCB3aXRoIHJlcGVhdGVkIFN0YXRlLnNldCBjYWxsc1xuICAgICAgICAgIHJldHVybiAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICByZXR1cm4gdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgU3RhdGUud2F0Y2goZmllbGRzLCBzdGF0ZVdhdGNoZXIpO1xuXG4gICAgICAgIHZpZXdEaXJlY3RpdmVTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4gU3RhdGUucmVtb3ZlV2F0Y2hlcihzdGF0ZVdhdGNoZXIpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3ZpZXcnLCByb3V0ZVZpZXdGYWN0b3J5KTtcblxuY2xhc3MgUGVuZGluZ1ZpZXdDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoJHJvb3RTY29wZSkge1xuICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgfVxuXG4gIGluY3JlYXNlKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50ICs9IDE7XG4gIH1cblxuICBkZWNyZWFzZSgpIHtcbiAgICB0aGlzLmNvdW50ID0gTWF0aC5tYXgoMCwgdGhpcy5jb3VudCAtIDEpO1xuICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuaW5pdGlhbFZpZXdzTG9hZGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5jdXJyZW50Vmlld3NMb2FkZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1BlbmRpbmdWaWV3Q291bnRlcicsICgkcm9vdFNjb3BlKSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgUGVuZGluZ1ZpZXdDb3VudGVyKCRyb290U2NvcGUpO1xufSk7XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3Qge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5LCBsaXN0KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuXG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLndhdGNoZXJzID0gW107XG4gIH1cblxuICBnZXQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgfVxuXG4gIGdldEFsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0O1xuICB9XG5cbiAgZ2V0U3Vic2V0KHBhdGhzKSB7XG4gICAgcmV0dXJuIF8uemlwT2JqZWN0KHBhdGhzLCBfLm1hcChwYXRocywgdGhpcy5nZXQuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIuc2V0KHRoaXMubGlzdCwgcGF0aCwgdmFsdWUpO1xuICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIHVuc2V0KHBhdGhzKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLk9iamVjdEhlbHBlci51bnNldCh0aGlzLmxpc3QsIHBhdGgpO1xuICAgICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdhdGNoKHBhdGhzLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLndhdGNoZXJzLnB1c2godGhpcy5XYXRjaGVyRmFjdG9yeS5jcmVhdGUocGF0aCwgaGFuZGxlciwgdGhpcy5nZXQocGF0aCkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZVdhdGNoZXIod2F0Y2hlcikge1xuICAgIGlmICh0aGlzLndhdGNoZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdXYXRjaGVycyA9IFtdO1xuXG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHRoaXNXYXRjaGVyID0+IHtcbiAgICAgIGlmICh0aGlzV2F0Y2hlci5oYW5kbGVyICE9PSB3YXRjaGVyKSB7XG4gICAgICAgIG5ld1dhdGNoZXJzLnB1c2godGhpc1dhdGNoZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMud2F0Y2hlcnMgPSBuZXdXYXRjaGVycztcbiAgfVxuXG4gIF9ub3RpZnlXYXRjaGVycyhjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgd2F0Y2hlciA9PiB7XG4gICAgICBpZiAod2F0Y2hlci5zaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGggPSB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCB3YXRjaGVyLndhdGNoUGF0aCk7XG4gICAgICAgIHdhdGNoZXIubm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3RGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcbiAgfVxuXG4gIGNyZWF0ZShsaXN0ID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3QodGhpcy5PYmplY3RIZWxwZXIsIHRoaXMuV2F0Y2hlckZhY3RvcnksIGxpc3QpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hhYmxlTGlzdEZhY3RvcnknLCAoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3RGYWN0b3J5KE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpO1xufSk7XG5cbmNsYXNzIFdhdGNoZXIge1xuICBjb25zdHJ1Y3Rvcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHRoaXMud2F0Y2hQYXRoID0gd2F0Y2hQYXRoO1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChpbml0aWFsVmFsdWUpO1xuICB9XG5cbiAgX3Rva2VuaXplUGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKTtcbiAgfVxuXG4gIHNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICAvLyBOQiBzaG9ydCBjaXJjdWl0IGxvZ2ljIGluIHRoZSBzaW1wbGUgY2FzZVxuICAgIGlmICh0aGlzLndhdGNoUGF0aCA9PT0gY2hhbmdlZFBhdGgpIHtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHModGhpcy5jdXJyZW50VmFsdWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXRjaCA9IHtcbiAgICAgIHBhdGg6IHRoaXMud2F0Y2hQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgodGhpcy53YXRjaFBhdGgpLFxuICAgICAgdmFsdWU6IHRoaXMuY3VycmVudFZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IGNoYW5nZSA9IHtcbiAgICAgIHBhdGg6IGNoYW5nZWRQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgoY2hhbmdlZFBhdGgpLFxuICAgICAgdmFsdWU6IG5ld1ZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IG1pbmltdW1MZW50aCA9IE1hdGgubWluKGNoYW5nZS50b2tlbnMubGVuZ3RoLCB3YXRjaC50b2tlbnMubGVuZ3RoKTtcbiAgICBmb3IgKGxldCB0b2tlbkluZGV4ID0gMDsgdG9rZW5JbmRleCA8IG1pbmltdW1MZW50aDsgdG9rZW5JbmRleCsrKSB7XG4gICAgICBpZiAod2F0Y2gudG9rZW5zW3Rva2VuSW5kZXhdICE9PSBjaGFuZ2UudG9rZW5zW3Rva2VuSW5kZXhdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOQiBpZiB3ZSBnZXQgaGVyZSB0aGVuIGFsbCBjb21tb24gdG9rZW5zIG1hdGNoXG5cbiAgICBjb25zdCBjaGFuZ2VQYXRoSXNEZXNjZW5kYW50ID0gY2hhbmdlLnRva2Vucy5sZW5ndGggPiB3YXRjaC50b2tlbnMubGVuZ3RoO1xuXG4gICAgaWYgKGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQpIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGNoYW5nZS50b2tlbnMuc2xpY2Uod2F0Y2gudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCA9IF8uZ2V0KHdhdGNoLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyhjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoLCBjaGFuZ2UudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSB3YXRjaC50b2tlbnMuc2xpY2UoY2hhbmdlLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaFBhdGggPSBfLmdldChjaGFuZ2UudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHdhdGNoLnZhbHVlLCBuZXdWYWx1ZUF0V2F0Y2hQYXRoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5oYW5kbGVyKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgdGhpcy5jdXJyZW50VmFsdWUpO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAobmV3VmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoZXJGYWN0b3J5IHtcbiAgY3JlYXRlKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGVyKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoZXJGYWN0b3J5JywgKCkgPT4ge1xuICByZXR1cm4gbmV3IFdhdGNoZXJGYWN0b3J5KCk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignUm91dGUnLCBmdW5jdGlvbihPYmplY3RIZWxwZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuICBjb25zdCB0b2tlbnMgPSB7fTtcbiAgY29uc3QgdXJsV3JpdGVycyA9IFtdO1xuICBjb25zdCB1cmxzID0gW107XG4gIGNvbnN0IHBlcnNpc3RlbnRTdGF0ZXMgPSBbXTtcbiAgY29uc3QgcmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgdHlwZXMgPSB7fTtcbiAgbGV0IGh0bWw1TW9kZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3ZpZGVyID0ge1xuXG4gICAgcmVnaXN0ZXJUeXBlKG5hbWUsIGNvbmZpZykge1xuICAgICAgdHlwZXNbbmFtZV0gPSBjb25maWc7XG4gICAgICB0eXBlc1tuYW1lXS5yZWdleCA9IG5ldyBSZWdFeHAodHlwZXNbbmFtZV0ucmVnZXguc291cmNlLCAnaScpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVHlwZSB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxUb2tlbihuYW1lLCBjb25maWcpIHtcbiAgICAgIHRva2Vuc1tuYW1lXSA9IF8uZXh0ZW5kKHtuYW1lfSwgY29uZmlnKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFRva2VuIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFdyaXRlcihuYW1lLCBmbikge1xuICAgICAgdXJsV3JpdGVyc1tuYW1lXSA9IGZuO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsV3JpdGVyIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybChwYXR0ZXJuLCBjb25maWcgPSB7fSkge1xuICAgICAgY29uc3QgdXJsRGF0YSA9IHtcbiAgICAgICAgY29tcGlsZWRVcmw6IHRoaXMuX2NvbXBpbGVVcmxQYXR0ZXJuKHBhdHRlcm4sIGNvbmZpZyksXG4gICAgICAgIHBhdHRlcm5cbiAgICAgIH07XG5cbiAgICAgIHVybHMucHVzaChfLmV4dGVuZCh1cmxEYXRhLCBjb25maWcpKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybCB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGVyc2lzdGVudFN0YXRlcyguLi5zdGF0ZUxpc3QpIHtcbiAgICAgIF8uZm9yRWFjaChzdGF0ZUxpc3QsIChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIV8uaW5jbHVkZXMocGVyc2lzdGVudFN0YXRlcywgc3RhdGUpKSB7XG4gICAgICAgICAgcGVyc2lzdGVudFN0YXRlcy5wdXNoKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldEh0bWw1TW9kZShtb2RlKSB7XG4gICAgICBodG1sNU1vZGUgPSBtb2RlO1xuICAgIH0sXG5cbiAgICBfY29tcGlsZVVybFBhdHRlcm4odXJsUGF0dGVybiwgY29uZmlnKSB7XG4gICAgICBsZXQgbWF0Y2g7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyh1cmxQYXR0ZXJuKTtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2godXJsUGF0dGVybik7XG5cbiAgICAgIGNvbnN0IHRva2VuUmVnZXggPSAvXFx7KFtBLVphLXpcXC5fMC05XSspXFx9L2c7XG4gICAgICBsZXQgdXJsUmVnZXggPSB1cmxQYXR0ZXJuO1xuXG4gICAgICBpZiAoIWNvbmZpZy5wYXJ0aWFsTWF0Y2gpIHtcbiAgICAgICAgdXJsUmVnZXggPSBgXiR7dXJsUmVnZXh9JGA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRva2VuTGlzdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKG1hdGNoID0gdG9rZW5SZWdleC5leGVjKHVybFBhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1ttYXRjaFsxXV07XG4gICAgICAgIHRva2VuTGlzdC5wdXNoKHRva2VuKTtcbiAgICAgICAgdXJsUmVnZXggPSB1cmxSZWdleC5yZXBsYWNlKG1hdGNoWzBdLCBgKCR7dHlwZXNbdG9rZW4udHlwZV0ucmVnZXguc291cmNlfSlgKTtcbiAgICAgIH1cblxuICAgICAgdXJsUmVnZXgucmVwbGFjZSgnLicsICdcXFxcLicpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCh1cmxSZWdleCwgJ2knKSxcbiAgICAgICAgdG9rZW5zOiB0b2tlbkxpc3RcbiAgICAgIH07XG4gICAgfSxcblxuICAgIF9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2goc3RyKSB7XG4gICAgICBpZiAoc3RyLm1hdGNoKC9cXC8kLykpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXC8kLywgJy8/Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCR7c3RyfS8/YDtcbiAgICB9LFxuXG4gICAgX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXChcXClcXCpcXCtcXD9cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICB9LFxuXG4gICAgJGdldCgkbG9jYXRpb24sICRpbmplY3RvciwgJHEsICR3aW5kb3cpIHtcbiAgICAgICduZ0luamVjdCc7XG5cbiAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc2VydmljZSAob25seSBkb25lIG9uY2UpLCB3ZSBuZWVkIHRvIGl0ZXJhdGUgb3ZlciB0aGUgdXJsV3JpdGVycyBhbmQgdHVyblxuICAgICAgLy8gdGhlbSBpbnRvIG1ldGhvZHMgdGhhdCBpbnZva2UgdGhlIFJFQUwgdXJsV3JpdGVyLCBidXQgcHJvdmlkaW5nIGRlcGVuZGVuY3kgaW5qZWN0aW9uIHRvIGl0LCB3aGlsZSBhbHNvXG4gICAgICAvLyBnaXZpbmcgaXQgdGhlIGRhdGEgdGhhdCB0aGUgY2FsbGVlIHBhc3NlcyBpbi5cblxuICAgICAgLy8gVGhlIHJlYXNvbiB3ZSBoYXZlIHRvIGRvIHRoaXMgaGVyZSBpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoZSAkaW5qZWN0b3IgYmFjayBpbiB0aGUgcm91dGVQcm92aWRlci5cblxuICAgICAgXy5mb3JJbih1cmxXcml0ZXJzLCAod3JpdGVyLCB3cml0ZXJOYW1lKSA9PlxuICAgICAgICB1cmxXcml0ZXJzW3dyaXRlck5hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmICghZGF0YSkgeyBkYXRhID0ge307IH1cbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSB7VXJsRGF0YTogZGF0YX07XG4gICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5pbnZva2Uod3JpdGVyLCB7fSwgbG9jYWxzKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgbGV0IGZsYXNoU3RhdGVzID0gW107XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgIGN1cnJlbnRCaW5kaW5nczoge30sXG4gICAgICAgIHJlYWR5RGVmZXJyZWQ6ICRxLmRlZmVyKCksXG5cbiAgICAgICAgbWF0Y2godXJsVG9NYXRjaCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdXJsIG9mIEFycmF5LmZyb20odXJscykpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSB1cmwuY29tcGlsZWRVcmwucmVnZXguZXhlYyh1cmxUb01hdGNoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHt1cmwsIHJlZ2V4TWF0Y2g6IG1hdGNofTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERhdGEobWF0Y2gsIHNlYXJjaERhdGEgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMuZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKTtcbiAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5leHRyYWN0UGF0aERhdGEobWF0Y2gpO1xuICAgICAgICAgIHNlYXJjaERhdGEgPSB0aGlzLmV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpO1xuICAgICAgICAgIHJldHVybiBPYmplY3RIZWxwZXIuZGVmYXVsdChzZWFyY2hEYXRhLCBwYXRoLCBkZWZhdWx0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSkge1xuICAgICAgICAgIGlmICghc2VhcmNoRGF0YSkgeyBzZWFyY2hEYXRhID0gJGxvY2F0aW9uLnNlYXJjaCgpOyB9XG4gICAgICAgICAgY29uc3QgZGF0YSA9IF8uY2xvbmUoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKGRhdGEsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0S2V5ID0gXy5maW5kS2V5KHRva2VucywgeyBzZWFyY2hBbGlhczoga2V5IH0pO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRLZXkpIHsgdGFyZ2V0S2V5ID0ga2V5OyB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZU5hbWUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IF8uZ2V0KHRva2Vuc1t0YXJnZXRLZXldLCAndHlwZScpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCF0b2tlbnNbdGFyZ2V0S2V5XSB8fCAodHlwZXNbdG9rZW5UeXBlTmFtZV0ucmVnZXgudGVzdCh2YWx1ZSkpKSB7XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS50eXBlIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0eXBlVG9rZW5UeXBlID0gdG9rZW5UeXBlID8gdHlwZXNbdG9rZW5UeXBlXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlUGFyc2VkID0gdHlwZVRva2VuVHlwZSA/IHR5cGVUb2tlblR5cGUucGFyc2VyIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgIGlmICh0b2tlblR5cGVQYXJzZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodG9rZW5UeXBlUGFyc2VkLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblRhcmdldEtleVN0YXRlUGF0aCA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0uc3RhdGVQYXRoIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCBkYXRhS2V5ID0gdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggfHwgdGFyZ2V0S2V5O1xuXG4gICAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQobmV3RGF0YSwgZGF0YUtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKG1hdGNoLnVybC5zdGF0ZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwga2V5LCAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IF8uY2xvbmVEZWVwKHZhbHVlKSA6IHZhbHVlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0UGF0aERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICAgY29uc3QgcGF0aFRva2VucyA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnM7XG5cbiAgICAgICAgICBpZiAocGF0aFRva2Vucy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHt9OyB9XG5cbiAgICAgICAgICBmb3IgKGxldCBuID0gMCwgZW5kID0gcGF0aFRva2Vucy5sZW5ndGgtMSwgYXNjID0gMCA8PSBlbmQ7IGFzYyA/IG4gPD0gZW5kIDogbiA+PSBlbmQ7IGFzYyA/IG4rKyA6IG4tLSkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zW25dO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbWF0Y2gucmVnZXhNYXRjaFtuKzFdO1xuXG4gICAgICAgICAgICBpZiAodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyKSB7IHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIsIG51bGwsIHt0b2tlbjogdmFsdWV9KTsgfVxuXG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsICh0b2tlbi5zdGF0ZVBhdGggfHwgdG9rZW4ubmFtZSksIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXJzKCkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcihuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdvKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIGNvbnN0IHVybCA9IHRoaXMuaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEpXG4gICAgICAgICAgY29uc3QgaXNBYnNvbHV0ZVVybCA9ICgvXihodHRwcz86KXswLDF9XFwvXFwvLisvKS50ZXN0KHVybCk7XG4gICAgICAgICAgcmV0dXJuIChpc0Fic29sdXRlVXJsKVxuICAgICAgICAgICAgPyAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmxcbiAgICAgICAgICAgIDogJGxvY2F0aW9uLnVybCh1cmwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFBlcnNpc3RlbnRTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIHBlcnNpc3RlbnRTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZEZsYXNoU3RhdGVzKC4uLm5ld1N0YXRlcykge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gZmxhc2hTdGF0ZXMuY29uY2F0KG5ld1N0YXRlcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIGZsYXNoU3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lLCBiaW5kaW5nKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdID0gYmluZGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVsZXRlQ3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1hdGNoZXNDdXJyZW50QmluZGluZ05hbWUodmlld05hbWUsIGJpbmRpbmdOYW1lRXhwcmVzc2lvbikge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRCaW5kaW5nID0gdGhpcy5nZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSk7XG5cbiAgICAgICAgICBpZiAoIWN1cnJlbnRCaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGJpbmRpbmdOYW1lRXhwcmVzc2lvbiBpbnN0YW5jZW9mIFJlZ0V4cCA/XG4gICAgICAgICAgICBiaW5kaW5nTmFtZUV4cHJlc3Npb24udGVzdChjdXJyZW50QmluZGluZy5uYW1lKSA6XG4gICAgICAgICAgICBjdXJyZW50QmluZGluZy5uYW1lID09PSBiaW5kaW5nTmFtZUV4cHJlc3Npb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UmVhZHkocmVhZHkpIHtcbiAgICAgICAgICBpZiAoIXJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNSZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNIdG1sNU1vZGVFbmFibGVkKCkge1xuICAgICAgICAgIHJldHVybiBodG1sNU1vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2hlblJlYWR5KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5RGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICB9O1xuXG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbnVtZXJpYycsIHtyZWdleDogL1xcZCsvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiBwYXJzZUludCh0b2tlbildfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYWxwaGEnLCB7cmVnZXg6IC9bYS16QS1aXSsvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYW55Jywge3JlZ2V4OiAvLisvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbGlzdCcsIHtyZWdleDogLy4rLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gdG9rZW4uc3BsaXQoJywnKV19KTtcblxuICByZXR1cm4gcHJvdmlkZXI7XG59KTtcblxuY2xhc3MgU3RhdGVQcm92aWRlciB7XG4gICRnZXQoV2F0Y2hhYmxlTGlzdEZhY3RvcnkpIHtcbiAgICAnbmdJbmplY3QnO1xuICAgIHJldHVybiBXYXRjaGFibGVMaXN0RmFjdG9yeS5jcmVhdGUoKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdTdGF0ZScsIG5ldyBTdGF0ZVByb3ZpZGVyKTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignVmlld0JpbmRpbmdzJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCB2aWV3cyA9IFtdO1xuXG4gIGNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJpbmRpbmdzKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgaWYgKCEodGhpcy5iaW5kaW5ncyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0gW3RoaXMuYmluZGluZ3NdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEJpbmRpbmdzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3M7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIGJpbmQobmFtZSwgY29uZmlnKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShiaW5kaW5ncywgY29tbW9uUmVxdWlyZWRTdGF0ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoYmluZGluZy5yZXF1aXJlZFN0YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBbYmluZGluZy5yZXF1aXJlZFN0YXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goYmluZGluZy5yZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlLmNvbmNhdChjb21tb25SZXF1aXJlZFN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXNvbHZlKGJpbmRpbmdzLCBjb21tb25SZXNvbHZlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoISgncmVzb2x2ZScgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVzb2x2ZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChfLmRlZmF1bHRzKGJpbmRpbmcucmVzb2x2ZSwgY29tbW9uUmVzb2x2ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJhc2ljQ29tbW9uRmllbGRzID0gW1xuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUGVybWlzc2lvbkRlbmllZFRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ3Blcm1pc3Npb25EZW5pZWRUZW1wbGF0ZVVybCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUGVybWlzc2lvbkRlbmllZENvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdwZXJtaXNzaW9uRGVuaWVkQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdUZW1wbGF0ZVVybCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JUZW1wbGF0ZVVybCd9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCBjb21tb25GaWVsZCBvZiBBcnJheS5mcm9tKGJhc2ljQ29tbW9uRmllbGRzKSkge1xuICAgICAgICAgIGlmIChjb21tb25GaWVsZC5uYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgZGVmYXVsdEJpbmRpbmdGaWVsZChuZXdCaW5kaW5ncywgY29tbW9uRmllbGQub3ZlcnJpZGVGaWVsZCwgY29uZmlnW2NvbW1vbkZpZWxkLm5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlcXVpcmVkU3RhdGUnIGluIGNvbmZpZykge1xuICAgICAgICAgIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXF1aXJlZFN0YXRlJ10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXNvbHZlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb21tb25SZXNvbHZlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlc29sdmUnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdEJpbmRpbmdGaWVsZChiaW5kaW5ncywgZmllbGROYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgIGlmICghKGZpZWxkTmFtZSBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgaXRlbSA9IGJpbmRpbmdbZmllbGROYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
