# ajwah-devtools

### Ajwah devTools for ajwah store(react, angular, vue, preact)

### React, Preact
```js
import { setStoreContext } from 'ajwah-react-store';
import { devTools } from 'ajwah-devtools';
setStoreContext({
    states: [CounterSate, TutorialState],
    effects: [CounterEffect],
    devTools: devTools({ maxAge: 8 })
});

```

### Angular
```js
import { AjwahStoreModule } from 'ajwah-angular-store';
import { devTools } from 'ajwah-devtools';

AjwahStoreModule.bootstrap({
      states: [counterState],
      effects: [CounterEffect],
      devTools: devTools({maxAge: 8})
    })

```


### Vue
```js
import { AjwahStore } from 'ajwah-vue-store';
import { devTools } from 'ajwah-devtools';

Vue.use(AjwahStore, {
  states: [counterState, tutorialState, todoState],
  effects: [CounterEffect],
  devTools: devTools({ name: 'vue devTools' })
})

```

