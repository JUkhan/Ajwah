import * as React from "react";
export interface Props {
  name: string;
}
export class Group extends React.PureComponent<Props, any> {
  render() {
    const { name, children } = this.props;
    let childList = React.Children.toArray(children);
    this.resolveGroupName(name, childList);
    return childList;
  }
  resolveGroupName(groupName: string = "default", children: any[]) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (typeof child.type === "function" && child.type.name === "Field") {
        children[i] = React.cloneElement(child, {
          ...child.props,
          name: `${groupName}.${child.props.name}`,
        });
      } else if (
        typeof child.type === "function" &&
        (child.type.name === "Group" || child.type.name === "RxForm")
      ) {
        continue;
      } else {
        this.resolveGroupName(
          groupName,
          React.Children.toArray(child.children)
        );
      }
    }
  }
}
