// Test setup file for DPML package
import 'reflect-metadata';

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidDpml(): R;
      toHaveElementType(elementType: string): R;
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidDpml(received: string) {
    try {
      const { validateDpml } = require('../index');
      const result = validateDpml(received);
      
      if (result.valid) {
        return {
          message: () => `Expected DPML to be invalid, but it was valid`,
          pass: true,
        };
      } else {
        return {
          message: () => `Expected DPML to be valid, but got errors: ${result.errors.join(', ')}`,
          pass: false,
        };
      }
    } catch (error) {
      return {
        message: () => `Error validating DPML: ${error}`,
        pass: false,
      };
    }
  },

  toHaveElementType(received: any, elementType: string) {
    const constructorName = received.constructor.name;
    const expectedName = elementType + 'Element';
    
    if (constructorName === expectedName) {
      return {
        message: () => `Expected element not to be of type ${expectedName}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected element to be of type ${expectedName}, but got ${constructorName}`,
        pass: false,
      };
    }
  },
});

// Test data constants
export const SAMPLE_DPML = {
  SIMPLE_ROLE: `
    <role>
      <personality>AI Assistant</personality>
      <principle>Be helpful and accurate</principle>
      <knowledge>General knowledge base</knowledge>
    </role>
  `,
  
  SIMPLE_EXECUTION: `
    <execution>
      <process>1. Understand request 2. Provide response</process>
      <guideline>Be clear and concise</guideline>
    </execution>
  `,
  
  WITH_RESOURCES: `
    <execution>
      <process>Check documentation</process>
      @docs:api/reference
      @github:examples/sample.md
    </execution>
  `,
  
  COMPLEX_PROMPT: `
    <role>
      <personality>Senior Software Architect</personality>
      <principle>Follow SOLID principles</principle>
      <knowledge>Microservices, Cloud Architecture</knowledge>
    </role>
    
    <execution>
      <process>
        1. Analyze requirements
        2. Design architecture
        3. Create documentation
      </process>
      <guideline>Use established patterns</guideline>
      <rule>All services must be independently deployable</rule>
      <constraint>Budget: $100k, Timeline: 6 months</constraint>
      <criteria>99.9% uptime, <200ms response time</criteria>
      @aws:reference-architectures/microservices
    </execution>
    
    <thought>
      <exploration>What are the key challenges?</exploration>
      <reasoning>Based on scalability requirements</reasoning>
      <plan>Phased implementation approach</plan>
      <challenge>Data consistency across services</challenge>
    </thought>
  `,
  
  TERMINOLOGIES: `
    <terminologies>
      <terminology>
        <zh>微服务</zh>
        <en>Microservices</en>
        <definition>Architectural pattern for building distributed systems</definition>
        <examples>
          <example>Netflix architecture</example>
          <example>Amazon services</example>
        </examples>
      </terminology>
    </terminologies>
  `,
  
  INVALID_SYNTAX: `
    <role>
      <personality>AI Assistant
    </role>
  `,
  
  UNKNOWN_ELEMENT: `
    <unknown>
      <content>Invalid content</content>
    </unknown>
  `
};

// Test helper functions
export function createMockVisitor() {
  return {
    visitPromptElement: jest.fn().mockResolvedValue('prompt'),
    visitRoleElement: jest.fn().mockResolvedValue('role'),
    visitPersonalityElement: jest.fn().mockResolvedValue('personality'),
    visitPrincipleElement: jest.fn().mockResolvedValue('principle'),
    visitKnowledgeElement: jest.fn().mockResolvedValue('knowledge'),
    visitExecutionElement: jest.fn().mockResolvedValue('execution'),
    visitProcessElement: jest.fn().mockResolvedValue('process'),
    visitGuidelineElement: jest.fn().mockResolvedValue('guideline'),
    visitRuleElement: jest.fn().mockResolvedValue('rule'),
    visitConstraintElement: jest.fn().mockResolvedValue('constraint'),
    visitCriteriaElement: jest.fn().mockResolvedValue('criteria'),
    visitResourceElement: jest.fn().mockResolvedValue('resource'),
    visitLocationElement: jest.fn().mockResolvedValue('location'),
    visitParamsElement: jest.fn().mockResolvedValue('params'),
    visitRegistryElement: jest.fn().mockResolvedValue('registry'),
    visitTerminologiesElement: jest.fn().mockResolvedValue('terminologies'),
    visitTerminologyElement: jest.fn().mockResolvedValue('terminology'),
    visitZhElement: jest.fn().mockResolvedValue('zh'),
    visitEnElement: jest.fn().mockResolvedValue('en'),
    visitDefinitionElement: jest.fn().mockResolvedValue('definition'),
    visitExamplesElement: jest.fn().mockResolvedValue('examples'),
    visitExampleElement: jest.fn().mockResolvedValue('example'),
    visitThoughtElement: jest.fn().mockResolvedValue('thought'),
    visitExplorationElement: jest.fn().mockResolvedValue('exploration'),
    visitReasoningElement: jest.fn().mockResolvedValue('reasoning'),
    visitPlanElement: jest.fn().mockResolvedValue('plan'),
    visitChallengeElement: jest.fn().mockResolvedValue('challenge'),
  };
}

export function expectElementStructure(element: any, expectedStructure: any) {
  for (const [key, value] of Object.entries(expectedStructure)) {
    if (typeof value === 'object' && value !== null) {
      expect(element[key]).toBeDefined();
      expectElementStructure(element[key], value);
    } else {
      expect(element[key]).toEqual(value);
    }
  }
}
