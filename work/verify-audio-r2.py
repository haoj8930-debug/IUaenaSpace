import sys,time,requests
url,expected=sys.argv[1],int(sys.argv[2])
for attempt in range(5):
    try:
        with requests.Session() as session:
            head=session.head(url,timeout=(12,30))
            if head.status_code!=200 or int(head.headers.get('Content-Length',0))!=expected:
                raise ValueError('Remote file size check failed')
            probe=session.get(url,headers={'Range':'bytes=0-31'},timeout=(12,30))
            if probe.status_code!=206 or len(probe.content)!=32:
                raise ValueError('Remote byte range check failed')
        print('verified');break
    except Exception as error:
        if attempt==4:raise
        time.sleep(2+attempt)
