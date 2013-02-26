var fdom = fdom || {};

/**
 * A FreeDOM view is provided as a core service to providers, allowing them
 * the capability of providing screen realestate.  Implementation is conducted
 * as a sandboxed iFrame at separate origin, whose sendMessage channel is
 * given to the provider.
 */
fdom.View = function() {
};

fdom.View.prototype.show = function(continuation) {
  var host = document.createElement("div");
  document.body.appendChild(host);
  var root = host.webkitCreateShadowRoot();
  var frame = document.createElement("iframe");
  frame.setAttribute("sandbox", "allow-scripts");
  frame.src = "data:text/html;charset=utf-8,<html><script type='text/javascript'>(" + fdom.View.prototype.controller.toString() + ")();</script></html>";
  frame.style.position = 'fixed';
  frame.style.top = '0px';
  frame.style.left = '0px';
  frame.style.width = '100%';
  frame.style.height = '100%';
  frame.style.background = 'white';
  frame.style.border = '0px';
  root.appendChild(frame);
  this.win = frame;
  continuation({});
}

fdom.View.prototype.write = function(data, continuation) {
  this.win.contentWindow.postMessage(data, '*');
  continuation({});
}

fdom.View.prototype.close = function() {
  console.log("close called.");
}

/**
 * The controller function is executed within a view to establish connectivity back
 * to the view container.
 */
fdom.View.prototype.controller = function() {
  window.addEventListener('message', function(m) {
    console.log(m.data);
    document.body.innerText = m.data;
  });
}

fdom.apis.register("core.view", fdom.View);
