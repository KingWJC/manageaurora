import { install } from "resize-observer";
// import {Message} from "element-ui";

const AutoFocusInput = function () {
    if(!window.ResizeObserver) {
        install();
    }

    let inputs = null;

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            if(entry.target === document.body) {
                // 当body尺寸变动时
                if(inputs && findScrollableAncestor(inputs)) {
                    // 滚动到目标元素位置
                    scrollAncestorToElement(findScrollableAncestor(inputs), inputs);
                }
            }
        }
    });
    observer.observe(document.body);

    // 给文档添加focus事件监听
    document.addEventListener('focus', () => {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            inputs = activeElement;
        }
    }, true);

    // 给文档添加blur事件监听
    // 当监听到blur事件时，清除需要滚动至的元素
    document.addEventListener('blur', () => {
        inputs = null;
    }, true);

    /**
     * 找到可以滚动元素的祖先dom，没有则返回null
     * @param element
     * @returns {null||HTMLElement}
     */
    function findScrollableAncestor(element) {
        let parentNode = element.parentNode;

        while (parentNode !== null && parentNode !== undefined) {
            if (parentNode.scrollHeight > parentNode.clientHeight) {
                return parentNode;
            }

            parentNode = parentNode.parentNode;
        }

        return null;
    }

    /**
     * 让祖先元素平滑滚动到目标元素位置
     * @param ancestor 祖先元素
     * @param element 目标元素
     */
    function scrollAncestorToElement(ancestor, element) {
        const ancestorRect = ancestor.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = elementRect.top - ancestorRect.top + ancestor.scrollTop;

        const timer = setTimeout(() => {
            clearTimeout(timer);
            ancestor.scrollTo({
                top: scrollTop - 10,
                behavior: 'smooth'
            });
        }, 600)
    }
}

export default AutoFocusInput