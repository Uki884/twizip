import React, { useState } from 'react'
import {
  Container,
  Menu,
} from 'semantic-ui-react'

function BaseLayout({ children }: any) {
  return <div>
  <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          Twizip
        </Menu.Item>
      </Container>
    </Menu>
    <div>{children}</div>
  </div>
}

export default BaseLayout