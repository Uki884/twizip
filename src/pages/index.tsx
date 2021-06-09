import React, { useState } from 'react'
import styled from 'styled-components';
import { Modal, Button, Icon, Input } from 'semantic-ui-react'
import { useTwitter } from '../utils/twitter'
import Long from 'long'
import JSZipUtils from 'jszip-utils'
import JSZip from 'jszip'
import { saveAs } from 'file-saver';

const _Container = styled.div`
  height: 100vh;
  margin: 0 24px;
  text-align: left;
`

const _Index = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const __InputContainer = styled.div`
  div:first-child {
    margin: 20px;
  }
`

const Index = () => {
  const urls: { name: string; url: string }[] = []
  const twitter = new useTwitter()
  const [userName, setUserName] = useState('')

  const handleSearchUser = async () => {
    if (!userName) {
      alert('ユーザー名を入力してください')
      return
    }
    await getAllTimeLines()
    download()
    console.log(urls)
  }

  const getAllTimeLines = async (maxId: string = undefined) => {
    const payload = {
      userName,
      maxId,
    }
    let nextMaxId
    const result = await twitter.getUserTimeLine(payload)
    if (result.length === 0) {
      return
    }
    result.map((tweet: any) => {
      const searchUrl = 'https'
      const baseText = tweet.text.split(' ')[0]
      const hasUrl = baseText.indexOf(searchUrl)
      const text = hasUrl !== -1 ? baseText.slice(hasUrl) : baseText
      const outputText = text.indexOf(searchUrl) !== -1 ? 'image': text
      if (tweet.extended_entities) {
        tweet.extended_entities.media.forEach((media: any, index: number) => {
          if (media.type === 'video') {
            const video = media.video_info.variants.filter((item: any) => item.bitrate).sort((a: any, b: any) => b.bitrate - a.bitrate)[0]
            urls.push({ name: `${outputText}_${index + 1}`, url: video.url })
          } else if (media.type === 'photo') {
            urls.push({ name: `${outputText}_${index + 1}`, url: media.media_url_https })
          }
        })
      }
      const longId = Long.fromString(tweet.id_str);
      const longIdSub = longId.subtract(1);
      nextMaxId = longIdSub.toString();
    })
    await getAllTimeLines(nextMaxId)
  }

  const download = () => {
    const zip = new JSZip();
    let count = 0
    for (const url of urls) {
      JSZipUtils.getBinaryContent(url.url, (err: any, data: any) => {
        if (err) {
          console.log(err);
        }
        let fileName = ''
        const videoUrl = 'https://video.twimg.com'
        const isVideo = url.url.indexOf(videoUrl) !== -1
        fileName = isVideo ? `${url.name}.mp4` : `${url.name}.jpg`
        zip.file(fileName, data, { binary: true });
        count++
        if (count === urls.length) {
          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, "download.zip");
          }, function (err) {
            console.log(err);
          });
          }
        }
      );
    }
  }

  return (
    <_Container>
      <_Index>
        <div>特定のユーザーの最新3200ツイートのメディアをzip形式で取得します</div>
        <__InputContainer>
          <Input value={userName} onChange={(e)=> setUserName(e.target.value)} className="mr-4" />
          <Button color="blue" onClick={handleSearchUser}>ユーザー検索</Button>
        </__InputContainer>
      </_Index>
    </_Container>
  )
}
export default Index