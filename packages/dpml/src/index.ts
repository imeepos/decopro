import {
  ClassMetadata,
  InjectionToken,
  createClassDecorator
} from "@decopro/core";

// 标签
export interface TagOptions {
  description: string;
}
export const TAG_TOKEN = `TAG_TOKEN` as InjectionToken<
  ClassMetadata<TagOptions>
>;
export const Tag = createClassDecorator(TAG_TOKEN);

// 协议
export interface ProtocolOptions {
  description: string;
}
export const PROTOCOL_TOKEN = `PROTOCOL_TOKEN` as InjectionToken<
  ClassMetadata<ProtocolOptions>
>;
export const Protocol = createClassDecorator(PROTOCOL_TOKEN);

// 关键字
export interface KeywordOptions {
  falg: string;
  description: string;
}
export const KEYWORK_TOKEN = `KEYWORK_TOKEN` as InjectionToken<
  ClassMetadata<KeywordOptions>
>;
export const Keyword = createClassDecorator(KEYWORK_TOKEN);
