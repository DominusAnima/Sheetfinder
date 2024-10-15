export interface ToolbarItem {
  name: string;
  icon?: string;
  onClick: () => void;
}

interface Props {
  items: ToolbarItem[];
  style?: React.CSSProperties;
}

export default function Toolbar(props: Props) {
  return (
    <div className="toolbar" style={props.style}>
      {props.items.map((item, index) => (
        <button className="toolbar-button" key={index} onClick={item.onClick}>
          {item.icon && <img src={item.icon} alt={item.name} />}
          {item.name}
        </button>
      ))}
    </div>
  );
}
