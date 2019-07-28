import singleSpaLeakedGlobals from "./single-spa-leaked-globals";

describe("single-spa-leaked-globals", () => {
  afterEach(() => {
    delete window.foo;
  });

  it(`adds the global vars during mount and unmounts them during unmount`, () => {
    const lifecycles = singleSpaLeakedGlobals({
      globalVariableNames: ["foo"]
    });

    window.foo = "foo";

    return lifecycles.bootstrap().then(() => {
      expect(window.foo).toBe("foo");
      return lifecycles
        .mount()
        .then(() => {
          expect(window.foo).toBe("foo");
          return lifecycles.unmount();
        })
        .then(() => {
          expect(window.foo).toBe(undefined);
          return lifecycles.mount();
        })
        .then(() => {
          expect(window.foo).toBe("foo");
        });
    });
  });
});
