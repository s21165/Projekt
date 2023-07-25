import { ComponentProps } from "react";
export type StickyBoxConfig = {
    offsetTop?: number;
    offsetBottom?: number;
    bottom?: boolean;
};
export type UseStickyBoxOptions = StickyBoxConfig;
export declare const useStickyBox: ({ offsetTop, offsetBottom, bottom, }?: StickyBoxConfig) => import("react").Dispatch<import("react").SetStateAction<HTMLElement | null>>;
export type StickyBoxCompProps = StickyBoxConfig & Pick<ComponentProps<"div">, "children" | "className" | "style">;
declare const StickyBox: (props: StickyBoxCompProps) => JSX.Element;
export default StickyBox;
