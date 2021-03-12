import { ProductController } from "./productController";
import { DepartmentController } from "./departmentController";
import { dispatch } from "../dispatch";
import { ajwahTest } from "ajwah-test";

describe("productController", () => {
  let pc: ProductController;
  const dc = new DepartmentController();
  beforeEach(() => {
    pc = new ProductController();
  });

  afterEach(() => {
    pc.dispose();
  });

  it("initial state", async () => {
    await ajwahTest({
      build: () => pc.stream$,
      skip: 1,
      verify: (states) => {
        expect(states[0].products.length).toEqual(5);
      },
    });
  });

  it("select department", async () => {
    await ajwahTest({
      build: () => pc.stream$,
      act: () => {
        dispatch("selectDeparment", 2);
      },
      skip: 2,
      verify: (states) => {
        expect(states[0].path).toEqual("product/inDepartment/2");
      },
    });
  });
});
