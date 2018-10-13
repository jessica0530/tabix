import React from 'react';
import { Layout, notification } from 'antd';
import { Flex, FlexProps } from 'reflexy';
import { UIStore } from '@vzh/mobx-stores';
import { RootStore } from 'stores';
import Loader from 'components/Loader';
import { observer } from 'mobx-react';
import { IReactionDisposer, reaction } from 'mobx';
// import NavBar from './NavBar';
// import PageFooter from './PageFooter';
import css from './Page.css';

export interface Props extends FlexProps {
  uiStore?: UIStore<RootStore>;
  children?: React.ReactNode;
}

class Page extends React.Component<Props> {
  private readonly notificationReaction: IReactionDisposer;

  constructor(props: Props) {
    super(props);

    this.notificationReaction = reaction(
      () => this.props.uiStore && this.props.uiStore.notifications,
      list =>
        list &&
        list.forEach(n => {
          notification.open({
            key: n.id.toString(),
            type: n.type,
            message: n.text,
            description: '',
            duration: 0,
            onClose: () => {
              this.props.uiStore && this.props.uiStore.closeNotification(n.id);
            },
          });
        }),
      { fireImmediately: true }
    );
  }

  componentWillUnmount() {
    this.notificationReaction();
  }

  render() {
    const { uiStore, ...rest } = this.props;
    const showLoader = uiStore && uiStore.loading;
    // hide page loader while showing app loader to avoid double loaders
    // (!store.uiStore.loading || uiStore === store.uiStore);
    return (
      <Layout className={css.root}>
        {showLoader && <Loader />}

        {/*<NavBar />*/}

        <Flex
          column
          hfill
          grow
          shrink={false}
          component="main"
          className={css['main-container']}
          {...rest}
        />

        {/*<PageFooter />*/}
      </Layout>
    );
  }
}

export default observer(Page);
