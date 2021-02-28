import React  from "react";
import { RxForm, Field, required, FiledChange, email } from "ajwah-reactive-form";

const departments = [
  { name: "Regional", id: 1 },
  { name: "Nature", id: 2 },
  { name: "Seasonal", id: 3 }
];


function departmentChange(args: FiledChange) {
  const { observer, value } = args;
  if(!value)return
  observer.notify("cat", { loading: true });
  getCategories(value).then(data => {
    console.log(data);
    observer.notify("cat", { loading: false, value: "", data });
  });
}

function onSubmit(values: any) {
  console.log(values);
}

export default () => {
  return (
    <RxForm
      onSubmit={onSubmit}
      consumeState={state=>console.log('state: ',state)}
      consumeErrors={errors=>console.log('errors: ',errors)}
      // initialValues={{dept:'1', email:''}}
      render={({ handleSubmit, observer }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="dept"
            onChange={departmentChange}
            observer={observer}
            validators={[required("Select department")]}
            render={({ value, setValue, error, flag, setFlag }) => (
              <div>
                <select
                 onBlur={()=>setFlag(true)}
                  value={value}
                  onChange={e => setValue(e.currentTarget.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map(el => (
                    <option key={el.id} value={el.id}>
                      {el.name}
                    </option>
                  ))}
                </select>
                <div className="error">{flag && error}</div>
              </div>
            )}
          />
          <Field
            name="cat"
            observer={observer}
            validators={[required("Select Category")]}
            render={({ value, setValue, error, loading, data, flag, setFlag }) => (
              <div>
                <select
                onBlur={()=>setFlag(true)}
                  value={value}
                  onChange={e => setValue(e.currentTarget.value)}
                >
                  <option value="">Select Category</option>
                  {data.map((el:any) => (
                    <option key={el.id} value={el.id}>
                      {el.name}
                    </option>
                  ))}
                </select>
                <div className="error">{flag && error}</div>
                {loading && <span className="error">loading...</span>}
              </div>
            )}
          />
          <Field
            name="email"
            debounce
            onChange={({value, elm})=>elm.value=value}
            observer={observer}
            validators={[required("please input email"), email('Email is not valid')]}
            render={({ value, setValue, error, loading, setRef, flag, setFlag }) => (
              <div>
                <input
                type="text" ref={setRef}
                onBlur={()=>setFlag(true)}
                  
                  onChange={e => setValue(e.currentTarget.value)}
                />
                 <div>{value}</div>
                <div className="error">{flag && error}</div>
                {loading && <span className="error">loading...</span>}
              </div>
            )}
          />

          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={e =>{observer.reset(); }}>
              Reset
            </button>
          </div>
        </form>
      )}
    />
  );
};

function getCategories(deptid: any): Promise<any[]> {
  let data: any[] = [];
  switch (+deptid) {
    case 1:
      data = [
        { name: "French", id: 1 },
        { name: "Italian", id: 2 },
        { name: "Irish", id: 3 }
      ];
      break;

    case 2:
      data = [{ name: "Animal", id: 3 }, { name: "Flower", id: 4 }];
      break;
    case 3:
      data = [{ name: "Eid ul Fitr ", id: 5 }, { name: "Eid ul Adha", id: 6 }];
      break;
  }
  return new Promise(resolve => {
    setTimeout(() => resolve(data), 1000);
  });
}

