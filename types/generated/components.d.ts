import type { Attribute, Schema } from '@strapi/strapi';

export interface VideoDataChapter extends Schema.Component {
  collectionName: 'components_video_data_chapters';
  info: {
    displayName: 'Chapter';
    icon: 'slideshow';
  };
  attributes: {
    Scriptures: Attribute.String;
    StartTime: Attribute.String;
    Summary: Attribute.Blocks;
    Title: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'video-data.chapter': VideoDataChapter;
    }
  }
}
