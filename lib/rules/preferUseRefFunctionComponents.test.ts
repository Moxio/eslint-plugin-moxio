import { RuleTester } from "eslint";
import { preferUseRefFunctionComponents } from "./preferUseRefFunctionComponents";


const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			ecmaVersion: 6,
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
});

const ERROR_MSG = "Prefer useRef hook in Function components.";

ruleTester.run("prefer-useref-function-components", preferUseRefFunctionComponents, {
	valid: [
		{
			code: `const MyComponent = () => {
                const ref = useRef();
                return <div>valid</div>
            }`,
		},
		{
			code: `function MyComponent() {
               const ref = useRef();
                return <div>valid</div>
            }`,
		},
		{
			code: `class MyComponent extends React.Component {
                constructor(props) {
					super();
                    this.inputRef = React.createRef();
                }
                render() {
                   return <input type="text" ref={this.inputRef} />;
                }
            }`,
		},
		{
			code: `it("should be allowed in a test", () => {
              const ref = React.createRef();
             });`,
		},
	],
	invalid: [
		{
			code: `function MyComponent() {
                const ref = React.createRef();
                return <div>valid</div>
            }`,
			errors: [
				{
					message: ERROR_MSG,
				},
			],
		},
		{
			code: `const MyComponent = () => {
                const ref = React.createRef();
                return <div>valid</div>
            }`,
			errors: [
				{
					message: ERROR_MSG,
				},
			],
		},
	],
});
