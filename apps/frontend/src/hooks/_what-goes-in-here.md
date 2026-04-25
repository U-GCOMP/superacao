# What goes in hooks/?

- Custom hooks
- Simple and repeated logic functions that lives inside a component
- These can have any `React Hook` inside, such as `useState`, `useEffect`, etc.
- They must share **logic**, but never share **state** between components
- Be sure that you are applying the Single Responsability Principle so your hook can actually be reused
