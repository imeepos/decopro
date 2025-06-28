import { Tokenizer } from "../tokenizer";

describe("Tokenizer", () => {
    let tokenizer: Tokenizer;

    beforeEach(() => {
        tokenizer = new Tokenizer();
    });

    describe("Basic Tag Tokenization", () => {
        it("should tokenize simple opening tag", () => {
            const tokens = tokenizer.tokenize("<role>");
            expect(tokens).toEqual([
                { type: "OpenTag", value: "role" },
                { type: "TagEnd", value: ">" }
            ]);
        });

        it("should tokenize simple closing tag", () => {
            const tokens = tokenizer.tokenize("</role>");
            expect(tokens).toEqual([
                { type: "CloseTag", value: "role" }
            ]);
        });

        it("should tokenize self-closing tag", () => {
            const tokens = tokenizer.tokenize("<br/>");
            expect(tokens).toEqual([
                { type: "OpenTag", value: "br" },
                { type: "SelfCloseTagEnd", value: "/>" }
            ]);
        });

        it("should tokenize tag with attributes", () => {
            const tokens = tokenizer.tokenize('<resource protocol="aws-s3">');
            expect(tokens).toEqual([
                { type: "OpenTag", value: "resource" },
                { type: "Attribute", name: "protocol", value: "aws-s3" },
                { type: "TagEnd", value: ">" }
            ]);
        });

        it("should tokenize tag with multiple attributes", () => {
            const tokens = tokenizer.tokenize('<execution type="sequential" priority="high">');
            expect(tokens).toEqual([
                { type: "OpenTag", value: "execution" },
                { type: "Attribute", name: "type", value: "sequential" },
                { type: "Attribute", name: "priority", value: "high" },
                { type: "TagEnd", value: ">" }
            ]);
        });

        it("should tokenize boolean attribute", () => {
            const tokens = tokenizer.tokenize('<process async>');
            expect(tokens).toEqual([
                { type: "OpenTag", value: "process" },
                { type: "Attribute", name: "async", value: "true" },
                { type: "TagEnd", value: ">" }
            ]);
        });
    });

    describe("Resource Reference Tokenization", () => {
        it("should tokenize basic resource reference", () => {
            const tokens = tokenizer.tokenize("@aws-s3:design-specs");
            expect(tokens).toEqual([
                { type: "ResourceRef", value: "@aws-s3:design-specs" }
            ]);
        });

        it("should tokenize resource reference with query params", () => {
            const tokens = tokenizer.tokenize("@aws-s3:design-specs?version=latest");
            expect(tokens).toEqual([
                { type: "ResourceRef", value: "@aws-s3:design-specs?version=latest" }
            ]);
        });

        it("should tokenize lazy resource reference", () => {
            const tokens = tokenizer.tokenize("@?github:repo/file.md");
            expect(tokens).toEqual([
                { type: "ResourceRef", value: "@?github:repo/file.md" }
            ]);
        });

        it("should tokenize load resource reference", () => {
            const tokens = tokenizer.tokenize("@!database:users/schema");
            expect(tokens).toEqual([
                { type: "ResourceRef", value: "@!database:users/schema" }
            ]);
        });

        it("should tokenize complex resource reference", () => {
            const tokens = tokenizer.tokenize("@api:users/profile?id=123&format=json");
            expect(tokens).toEqual([
                { type: "ResourceRef", value: "@api:users/profile?id=123&format=json" }
            ]);
        });
    });

    describe("Text Tokenization", () => {
        it("should tokenize simple text", () => {
            const tokens = tokenizer.tokenize("Hello World");
            expect(tokens).toEqual([
                { type: "Text", value: "Hello World" }
            ]);
        });

        it("should preserve whitespace in text", () => {
            const tokens = tokenizer.tokenize("  Hello   World  ");
            expect(tokens).toEqual([
                { type: "Text", value: "  Hello   World  " }
            ]);
        });

        it("should handle text with line breaks", () => {
            const tokens = tokenizer.tokenize("Line 1\nLine 2\nLine 3");
            expect(tokens).toEqual([
                { type: "Text", value: "Line 1\nLine 2\nLine 3" }
            ]);
        });
    });

    describe("Mixed Content Tokenization", () => {
        it("should tokenize mixed tags and text", () => {
            const tokens = tokenizer.tokenize("<role>Software Architect</role>");
            expect(tokens).toEqual([
                { type: "OpenTag", value: "role" },
                { type: "TagEnd", value: ">" },
                { type: "Text", value: "Software Architect" },
                { type: "CloseTag", value: "role" }
            ]);
        });

        it("should tokenize text with resource references", () => {
            const tokens = tokenizer.tokenize("Check @aws-s3:docs for details");
            expect(tokens).toEqual([
                { type: "Text", value: "Check " },
                { type: "ResourceRef", value: "@aws-s3:docs" },
                { type: "Text", value: " for details" }
            ]);
        });

        it("should tokenize complex mixed content", () => {
            const tokens = tokenizer.tokenize('<process>Step 1: @api:users<br/>Step 2: Review</process>');
            expect(tokens).toEqual([
                { type: "OpenTag", value: "process" },
                { type: "TagEnd", value: ">" },
                { type: "Text", value: "Step 1: " },
                { type: "ResourceRef", value: "@api:users" },
                { type: "OpenTag", value: "br" },
                { type: "SelfCloseTagEnd", value: "/>" },
                { type: "Text", value: "Step 2: Review" },
                { type: "CloseTag", value: "process" }
            ]);
        });
    });

    describe("Error Handling", () => {
        it("should throw error for unclosed tag", () => {
            expect(() => tokenizer.tokenize("<role")).toThrow("Unclosed open tag");
        });

        it("should throw error for unclosed close tag", () => {
            expect(() => tokenizer.tokenize("</role")).toThrow("Unclosed close tag");
        });

        it("should handle invalid resource reference as text", () => {
            const tokens = tokenizer.tokenize("@invalid");
            expect(tokens).toEqual([
                { type: "Text", value: "@invalid" }
            ]);
        });
    });

    describe("Edge Cases", () => {
        it("should handle empty input", () => {
            const tokens = tokenizer.tokenize("");
            expect(tokens).toEqual([]);
        });

        it("should handle whitespace only", () => {
            const tokens = tokenizer.tokenize("   \n\t  ");
            expect(tokens).toEqual([
                { type: "Text", value: "   \n\t  " }
            ]);
        });

        it("should handle nested quotes in attributes", () => {
            const tokens = tokenizer.tokenize('<test attr="value with \\"quotes\\"">');
            expect(tokens).toEqual([
                { type: "OpenTag", value: "test" },
                { type: "Attribute", name: "attr", value: "value with \\\"quotes\\\"" },
                { type: "TagEnd", value: ">" }
            ]);
        });
    });
});
