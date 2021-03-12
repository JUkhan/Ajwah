import { PureComponent, Children, cloneElement } from "react";
export interface Props {
  name: string;
}
export class Group extends PureComponent<Props, any> {
  static key = "Group";
  render() {
    const { name, children } = this.props;
    let childList = Children.toArray(children);
    this.resolveGroupName(name, childList);
    return childList;
  }
  resolveGroupName(groupName: string = "default", children: any[]) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (typeof child.type === "function" && child.type.key === "Field") {
        children[i] = cloneElement(child, {
          ...child.props,
          name: `${groupName}.${child.props.name}`,
        });
      } else if (
        typeof child.type === "function" &&
        (child.type.key === "Group" || child.type.key === "RxForm")
      ) {
        continue;
      } else {
        this.resolveGroupName(groupName, Children.toArray(child.children));
      }
    }
  }
}
