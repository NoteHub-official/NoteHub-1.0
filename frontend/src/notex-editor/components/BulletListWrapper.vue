<template>
  <node-view-wrapper>
    <div
      class="notex-bullet-list d-flex"
      @mouseover="setFocused(true)"
      @mouseleave="setFocused(false)"
      :style="{ width: '100%' }"
    >
      <div class="notex-bullet-list__drag-handle d-flex align-center flex-column handles" contenteditable="false">
        <v-icon
          class="d-inline-block pt-2 drag-handle"
          :size="22"
          draggable="true"
          data-drag-handle
        >
          {{ focused ? "drag_indicator" : null }}
        </v-icon>
      </div>
      <node-view-content class="notex-bullet-list__content" :class="`${textAlign}`" as="ul" />
    </div>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from "@tiptap/vue-2";

export default {
  name: "BulletListWrapper",
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },
  props: {
    nodeViewProps,
    node: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  methods: {
    setFocused(focused) {
      this.focused = focused;
    },
  },
  computed: {
    textAlign() {
      return `text-${this.node.attrs.textAlign}`;
    },
  },
};
</script>

<style lang="scss">
.notex-bullet-list {
  li::marker {
    font-size: 1.2rem;
    font-weight: 400;
  }

  li {
    margin-left: 0.8rem;
  }

  .handles {
    width: 25px;
    opacity: 0.3;
  }

  .drag-handle {
    cursor: grab;
  }

  .setting-handle {
    cursor: pointer;
  }

  .notex-bullet-list__content {
    p {
      padding-left: 0 !important;
    }
    padding: 0.5rem;
    width: 100%;
    display: inline;
  }

  .notex-bullet-list__drag-handle {
    position: absolute;
    transform: translateX(-100%);
  }
}
</style>
