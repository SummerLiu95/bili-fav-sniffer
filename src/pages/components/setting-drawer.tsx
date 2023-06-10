import {Button, Col, Divider, Drawer, Row, Upload, UploadProps, Typography, QRCode, message} from 'antd';
import styles from '@/styles/components/setting-drawer.module.scss';
import React from 'react';
import {UploadChangeParam} from 'antd/es/upload';

const { Title } = Typography;

interface SettingProps {
    open: boolean;
    nextInvocationTime: string;
    drawerOnClose: () => void;
    uploadOnChange: (info: UploadChangeParam) => void;
}
export default function SettingDrawer({open, drawerOnClose, nextInvocationTime, uploadOnChange}: SettingProps) {
    const [qrcode, setQrcode] = React.useState('text');
    const [qrcodeStatus, setQrcodeStatus] = React.useState('active' as "loading" | "active" | "expired");

    const props: UploadProps = {
        name: 'file',
        action: '/api/upload',
        accept: ".json",
        showUploadList: false,
        onChange(info) {
            uploadOnChange(info);
        },
    };
    const exportConfig = async () => {
        try {
            const res = await fetch('/api/export')
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'config.json' // 设置下载文件名
            link.click()
        } catch (error) {
            console.error(error)
        }
    }

    const openChange = async function (open: boolean) {
        try {
            if (!open) {
                return;
            }
            setQrcodeStatus('loading');
            const response = await fetch('/api/login');
            const data = await response.json() as  { data: {url: string; qrcode_key: string} };
            setQrcode(data.data.url);
            setQrcodeStatus('active');
            const timer = setInterval(async () => {
                const loginInfoResponse = await fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        qrcode_key: data.data.qrcode_key
                    }),
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                });
                const loginInfoData = await loginInfoResponse.json() as {data: { code: number; refresh_token: string }};
                if (loginInfoData.data.code === 0) {
                    clearInterval(timer);
                } else if (loginInfoData.data.code === 86038) {
                    setQrcodeStatus('expired');
                    clearInterval(timer);
                }
            }, 5000)
        } catch (e) {
            message.error(`${e}`);
        }
    }

    return (
        <Drawer title="设置" placement="right" afterOpenChange={openChange} onClose={drawerOnClose} open={open}>
            <Title level={5}>账户登录</Title>
            <Row className={styles.row} justify="center">
                <QRCode value={qrcode} size={200} status={qrcodeStatus} onRefresh={() => openChange(true)}/>
            </Row>
            <Divider/>
            <Title level={5}>配置管理</Title>
            <Row className={styles.row}>
                <Col span={12}>
                    <Upload {...props} className={styles.import}>
                        <Button>导入配置</Button>
                    </Upload>
                </Col>
                <Col span={12}>
                    <Button onClick={exportConfig} className={styles.export} disabled={!nextInvocationTime}>
                        导出配置
                    </Button>
                </Col>
            </Row>
        </Drawer>
    )
}