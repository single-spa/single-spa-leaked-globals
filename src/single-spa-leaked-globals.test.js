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

  it(`throws if you don't pass in opts`, () => {
    expect(() => {
      singleSpaLeakedGlobals();
    }).toThrow();
  });

  it(`throws if globalVariablesNames is not an array`, () => {
    expect(() => {
      singleSpaLeakedGlobals({ globalVariableNames: "hi" });
    }).toThrow();
  });

  it(`throws if globalVariablesNames is not an array of strings`, () => {
    expect(() => {
      singleSpaLeakedGlobals({ globalVariableNames: ["foo", 123] });
    }).toThrow();
  });
});
