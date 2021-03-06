define(["exports", "module", "aurelia-templating"], function (exports, module, _aureliaTemplating) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var ViewStrategy = _aureliaTemplating.ViewStrategy;


  var hasTemplateElement = ("content" in document.createElement("template"));

  var JadeView = (function (ViewStrategy) {
    function JadeView(viewUrl, isCompiled) {
      this.viewUrl = JadeView.parseViewUrl(viewUrl, isCompiled);
    }

    _inherits(JadeView, ViewStrategy);

    _prototypeProperties(JadeView, {
      generateFragment: {
        value: function generateFragment(html) {
          var doc = document.createDocumentFragment();
          var div = document.createElement("div");
          div.innerHTML = html;
          while (div.firstChild) {
            doc.appendChild(div.firstChild);
          }

          if (!hasTemplateElement) {
            HTMLTemplateElement.bootstrap(doc);
          }

          var template = doc.querySelector("template");
          if (!template) {
            throw new Error("There was no template element found");
          }

          return template;
        },
        writable: true,
        configurable: true
      },
      parseViewUrl: {
        value: function parseViewUrl(moduleId, isCompiled) {
          return moduleId + (isCompiled ? "" : "!");
        },
        writable: true,
        configurable: true
      }
    }, {
      loadViewFactory: {
        value: function loadViewFactory(viewEngine, options) {
          var _this = this;
          return viewEngine.loader.loadModule(this.viewUrl).then(function (module) {
            var template = "default" in module ? module["default"] : module;

            template = JadeView.generateFragment(template(options.data));

            return viewEngine.loadTemplateResources(_this.viewUrl, template, _this.moduleId).then(function (resources) {
              var existing = viewEngine.importedViews[_this.viewUrl];
              if (existing) {
                return existing;
              }

              var viewFactory = viewEngine.viewCompiler.compile(template, resources, options);
              viewEngine.importedViews[_this.viewUrl] = viewFactory;
              return viewFactory;
            });
          });
        },
        writable: true,
        configurable: true
      }
    });

    return JadeView;
  })(ViewStrategy);

  module.exports = JadeView;
});