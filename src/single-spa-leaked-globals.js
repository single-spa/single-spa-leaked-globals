const defaultOpts = {
  globalVariableNames: []
};

export default function singleSpaLeakedGlobals(opts) {
  if (typeof opts !== "object") {
    throw Error(
      "single-spa-leaked-globals must be called with an 'opts' object"
    );
  }

  opts = { ...defaultOpts, ...opts };

  if (
    !Array.isArray(opts.globalVariableNames) ||
    opts.globalVariableNames.some(varName => typeof varName !== "string")
  ) {
    throw Error(
      "single-spa-leaked-globals must be called with a 'globalVariableNames' array of strings"
    );
  }

  return {
    bootstrap: bootstrap.bind(null, opts),
    mount: mount.bind(null, opts),
    unmount: unmount.bind(null, opts)
  };
}

function bootstrap(opts, props) {
  return Promise.resolve().then(() => {
    opts.capturedGlobals = {};
    opts.globalVariableNames.forEach(globalVarName => {
      opts.capturedGlobals[globalVarName] = window[globalVarName];
    });
  });
}

function mount(opts, props) {
  return Promise.resolve().then(() => {
    opts.globalVariableNames.forEach(globalVarName => {
      window[globalVarName] = opts.capturedGlobals[globalVarName];
    });
  });
}

function unmount(opts, props) {
  return Promise.resolve().then(() => {
    opts.globalVariableNames.forEach(globalVarName => {
      delete window[globalVarName];
    });
  });
}
